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
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.webkit.WebView;
import android.widget.TextView;
import androidx.core.graphics.Insets;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;
import java.util.Locale;

public class MainActivity extends BridgeActivity {

    private int lastTopPx = -1;
    private int lastBottomPx = -1;
    private int lastLeftPx = -1;
    private int lastRightPx = -1;

    private View splashOverlay;
    private final Handler splashHandler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 0. System launch splash is only a plain background (see styles.xml); dismiss it on the first frame
        //    and show the full Hasana splash below instead.
        SplashScreen.installSplashScreen(this);

        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // 1. Enable true edge-to-edge drawing so WebView extends under status & nav bars
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // 2. Make status bar and navigation bar transparent so the emerald app theme fills edge-to-edge
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
        }

        // 3. Keep status bar and navigation bar icons light (white) on dark emerald background
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        if (controller != null) {
            controller.setAppearanceLightStatusBars(false);
            controller.setAppearanceLightNavigationBars(false);
        }

        // 4. Dynamic Screen Fit Insets Listener
        View decorView = window.getDecorView();
        ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, insets) -> {
            // NEVER let the native decorView shrink or add padding bars (fixes the double-gap issue)
            v.setPadding(0, 0, 0, 0);

            Insets systemBars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );
            boolean keyboardVisible = insets.isVisible(WindowInsetsCompat.Type.ime());

            float density = getResources().getDisplayMetrics().density;
            if (density <= 0f) {
                density = 1.0f;
            }

            int topPx = Math.round(systemBars.top / density);
            int bottomPx = keyboardVisible ? 0 : Math.round(systemBars.bottom / density);
            int leftPx = Math.round(systemBars.left / density);
            int rightPx = Math.round(systemBars.right / density);

            applyInsetsToWeb(topPx, bottomPx, leftPx, rightPx);

            return insets;
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

        // Keep the splash content clear of the status / navigation bars (like the web safe-area padding)
        int padTop = overlay.getPaddingTop();
        int padBottom = overlay.getPaddingBottom();
        ViewCompat.setOnApplyWindowInsetsListener(overlay, (v, insets) -> {
            Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            v.setPadding(v.getPaddingLeft(), padTop + bars.top, v.getPaddingRight(), padBottom + bars.bottom);
            return insets;
        });
        ViewCompat.requestApplyInsets(overlay);

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
