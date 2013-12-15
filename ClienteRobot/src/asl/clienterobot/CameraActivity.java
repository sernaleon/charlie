package asl.clienterobot;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import android.view.Window;
import android.webkit.WebView;

public class CameraActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_camera);
		

        WebView myWebView = (WebView) this.findViewById(R.id.webView);
		myWebView.loadUrl("http://"+GlobalValues.SERVER_IP+":"+GlobalValues.SERVER_CAM_PORT+"/");//stream_simple.html");
        //myWebView.getSettings().setJavaScriptEnabled(true);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.camera, menu);
		return true;
	}

}
