package com.hasanaa.app;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Matrix;
import android.graphics.RadialGradient;
import android.graphics.Shader;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RectShape;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.webkit.WebView;
import android.widget.TextView;
import androidx.activity.EdgeToEdge;
import androidx.activity.SystemBarStyle;
import androidx.core.graphics.Insets;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;
import java.util.Locale;

public class MainActivity extends BridgeActivity {

    // Sane upper bounds (dp) so a bogus inset (e.g. while the screen is locked / turning on) never
    // leaves a huge empty band in the header or footer.
    private static final int MAX_TOP_INSET_DP = 72;
    private static final int MAX_BOTTOM_INSET_DP = 64;
    private static final int MAX_SIDE_INSET_DP = 64;

    private int lastTopPx = -1;
    private int lastBottomPx = -1;
    private int lastLeftPx = -1;
    private int lastRightPx = -1;

    private View splashOverlay;
    private Insets lastSystemBars = Insets.NONE;
    private final Handler splashHandler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 0. System launch splash is only a plain background (see styles.xml); dismiss it on the first frame
        //    and show the full Hasana splash below instead.
        SplashScreen.installSplashScreen(this);

        super.onCreate(savedInstanceState);

        // 1-3. True edge-to-edge on every Android version with transparent system bars and light (white) icons,
        //      via the supported androidx API (the old setStatusBarColor / setNavigationBarColor calls are
        //      deprecated since Android 15 and flagged by Play Console).
        EdgeToEdge.enable(
            this,
            SystemBarStyle.dark(Color.TRANSPARENT),
            SystemBarStyle.dark(Color.TRANSPARENT)
        );

        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // 4. Dynamic Screen Fit Insets Listener
        View decorView = window.getDecorView();
        ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, insets) -> {
            Insets systemBars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );
            Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());
            boolean keyboardVisible = insets.isVisible(WindowInsetsCompat.Type.ime());
            lastSystemBars = systemBars;
            padSplashOverlay();

            // The native decorView never gets padding bars (fixes the double-gap issue); only the keyboard
            // pushes the WebView up so focused inputs stay visible.
            v.setPadding(0, 0, 0, keyboardVisible ? ime.bottom : 0);

            float density = getResources().getDisplayMetrics().density;
            if (density <= 0f) {
                density = 1.0f;
            }

            int topPx = clampInset(Math.round(systemBars.top / density), MAX_TOP_INSET_DP);
            int bottomPx = keyboardVisible ? 0 : clampInset(Math.round(systemBars.bottom / density), MAX_BOTTOM_INSET_DP);
            int leftPx = clampInset(Math.round(systemBars.left / density), MAX_SIDE_INSET_DP);
            int rightPx = clampInset(Math.round(systemBars.right / density), MAX_SIDE_INSET_DP);

            applyInsetsToWeb(topPx, bottomPx, leftPx, rightPx);

            // Hand the WebView zeroed system-bar insets: the page already pads itself with the values injected
            // above, so a newer Chromium WebView must not add its own safe-area / padding on top of them
            // (that is what produced the extra header / footer gap on some devices and after screen off/on).
            return new WindowInsetsCompat.Builder(insets)
                .setInsets(
                    WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout(),
                    Insets.of(0, 0, 0, 0)
                )
                .build();
        });

        // 5. Full launch splash (same as the web splash) on top of the WebView until the page is visible
        showSplashOverlay();

        // 6. Re-inject insets whenever a page or SPA route loads
        if (getBridge() != null) {
            getBridge().addWebViewListener(new WebViewListener() {
                @Override
                public void onPageCommitVisible(WebView view, String url) {
                    super.onPageCommitVisible(view, url);
                    forceRefreshInsets();
                    // The page starts with the identical HTML splash, so the hand-off is seamless
                    hideSplashOverlay(150);
                }

                @Override
                public void onPageLoaded(WebView view) {
                    super.onPageLoaded(view);
                    forceRefreshInsets();
                }
            });
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        // Screen off/on or returning from another app: the system bars may have been reported differently
        // while locked, so push the real insets to the page again.
        forceRefreshInsets();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            forceRefreshInsets();
        }
    }

    private static int clampInset(int valueDp, int maxDp) {
        if (valueDp < 0) {
            return 0;
        }
        return Math.min(valueDp, maxDp);
    }

    private void showSplashOverlay() {
        ViewGroup content = findViewById(android.R.id.content);
        if (content == null) {
            return;
        }
        View overlay = getLayoutInflater().inflate(R.layout.splash_overlay, content, false);
        splashOverlay = overlay;
        content.addView(overlay);

        // Same radial gradient as .hs-splash-screen: ellipse at 50% 30%, #0c5c46 -> #07382a (60%) -> #041c14
        ShapeDrawable background = new ShapeDrawable(new RectShape());
        background.setShaderFactory(new ShapeDrawable.ShaderFactory() {
            @Override
            public Shader resize(int width, int height) {
                // CSS farthest-corner ellipse: radii = distance to the corner * sqrt(2) on each axis
                float cx = width * 0.5f;
                float cy = height * 0.3f;
                RadialGradient gradient = new RadialGradient(
                    0, 0, 1f,
                    new int[] { 0xFF0C5C46, 0xFF07382A, 0xFF041C14 },
                    new float[] { 0f, 0.6f, 1f },
                    Shader.TileMode.CLAMP
                );
                Matrix matrix = new Matrix();
                matrix.setScale(Math.max(1f, cx * 1.4142f), Math.max(1f, (height - cy) * 1.4142f));
                matrix.postTranslate(cx, cy);
                gradient.setLocalMatrix(matrix);
                return gradient;
            }
        });
        overlay.setBackground(background);

        // Round the logo to its background shape so its square corners don't cover the gold frame
        // (set here because the android:clipToOutline XML attribute needs Android 12)
        overlay.findViewById(R.id.splash_logo_image).setClipToOutline(true);

        TextView title = overlay.findViewById(R.id.splash_title);
        View logo = overlay.findViewById(R.id.splash_logo);
        View glow = overlay.findViewById(R.id.splash_glow);
        View loader = overlay.findViewById(R.id.splash_loader);
        View bar = overlay.findViewById(R.id.splash_bar);

        title.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, or, ob) -> {
            // Gold gradient title text (white -> #f6dc8f -> #dfab3b)
            title.getPaint().setShader(new LinearGradient(
                0, 0, 0, title.getHeight(),
                new int[] { Color.WHITE, Color.WHITE, 0xFFF6DC8F, 0xFFDFAB3B },
                new float[] { 0f, 0.25f, 0.65f, 1f },
                Shader.TileMode.CLAMP
            ));
            title.invalidate();
        });

        // Keep the splash content clear of the status / navigation bars (like the web safe-area padding).
        // The decorView listener hands children zeroed insets, so the overlay is padded from the raw values.
        splashBasePadTop = overlay.getPaddingTop();
        splashBasePadBottom = overlay.getPaddingBottom();
        padSplashOverlay();

        // Logo glow pulse and indeterminate gold loader bar
        ObjectAnimator pulseX = ObjectAnimator.ofFloat(logo, View.SCALE_X, 0.98f, 1.02f);
        ObjectAnimator pulseY = ObjectAnimator.ofFloat(logo, View.SCALE_Y, 0.98f, 1.02f);
        ObjectAnimator glowAlpha = ObjectAnimator.ofFloat(glow, View.ALPHA, 0.55f, 1f);
        for (ObjectAnimator a : new ObjectAnimator[] { pulseX, pulseY, glowAlpha }) {
            a.setDuration(2400);
            a.setRepeatMode(ValueAnimator.REVERSE);
            a.setRepeatCount(ValueAnimator.INFINITE);
            a.setInterpolator(new AccelerateDecelerateInterpolator());
            a.start();
        }
        loader.post(() -> {
            ObjectAnimator slide = ObjectAnimator.ofFloat(bar, View.TRANSLATION_X, -bar.getWidth(), bar.getWidth() * 3f);
            slide.setDuration(1400);
            slide.setRepeatCount(ValueAnimator.INFINITE);
            slide.setInterpolator(new AccelerateDecelerateInterpolator());
            slide.start();
        });

        // Never block the app if the page never reports itself visible
        hideSplashOverlay(10000);
    }

    private int splashBasePadTop = 0;
    private int splashBasePadBottom = 0;

    private void padSplashOverlay() {
        View overlay = splashOverlay;
        if (overlay == null) {
            return;
        }
        overlay.setPadding(
            overlay.getPaddingLeft(),
            splashBasePadTop + lastSystemBars.top,
            overlay.getPaddingRight(),
            splashBasePadBottom + lastSystemBars.bottom
        );
    }

    private void hideSplashOverlay(long delayMs) {
        splashHandler.postDelayed(() -> {
            View overlay = splashOverlay;
            if (overlay == null) {
                return;
            }
            splashOverlay = null;
            splashHandler.removeCallbacksAndMessages(null);
            overlay.animate().alpha(0f).setDuration(300).withEndAction(() -> {
                if (overlay.getParent() instanceof ViewGroup) {
                    ((ViewGroup) overlay.getParent()).removeView(overlay);
                }
            }).start();
        }, delayMs);
    }

    private void forceRefreshInsets() {
        lastTopPx = -1;
        lastBottomPx = -1;
        lastLeftPx = -1;
        lastRightPx = -1;
        runOnUiThread(() -> {
            if (getWindow() != null && getWindow().getDecorView() != null) {
                getWindow().getDecorView().requestApplyInsets();
            }
        });
    }

    private void applyInsetsToWeb(int topPx, int bottomPx, int leftPx, int rightPx) {
        if (topPx == lastTopPx && bottomPx == lastBottomPx && leftPx == lastLeftPx && rightPx == lastRightPx) {
            return;
        }
        lastTopPx = topPx;
        lastBottomPx = bottomPx;
        lastLeftPx = leftPx;
        lastRightPx = rightPx;

        runOnUiThread(() -> {
            if (getBridge() != null && getBridge().getWebView() != null) {
                WebView webView = getBridge().getWebView();
                String js = String.format(
                    Locale.US,
                    "(function() {" +
                    "  var r = document.documentElement;" +
                    "  r.classList.add('has-native-insets');" +
                    "  r.style.setProperty('--safe-area-inset-top', '%dpx');" +
                    "  r.style.setProperty('--safe-area-inset-bottom', '%dpx');" +
                    "  r.style.setProperty('--safe-area-inset-left', '%dpx');" +
                    "  r.style.setProperty('--safe-area-inset-right', '%dpx');" +
                    "})();",
                    topPx, bottomPx, leftPx, rightPx
                );
                webView.evaluateJavascript(js, null);
            }
        });
    }
}
