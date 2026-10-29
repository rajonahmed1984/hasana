package com.hasanaa.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;
import androidx.core.graphics.Insets;
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
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

        // 5. Re-inject insets whenever a page or SPA route loads
        if (getBridge() != null) {
            getBridge().addWebViewListener(new WebViewListener() {
                @Override
                public void onPageCommitVisible(WebView view, String url) {
                    super.onPageCommitVisible(view, url);
                    forceRefreshInsets();
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    forceRefreshInsets();
                }
            });
        }
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
