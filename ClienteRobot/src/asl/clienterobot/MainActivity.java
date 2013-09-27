package asl.clienterobot;

import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.widget.TextView;

public class MainActivity extends Activity implements SensorEventListener 
{
	SocketRobot socketR;
    
    @Override
    public void onCreate(Bundle savedInstanceState) 
    {
    	//Sets view
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        //Sets accelerometer
        SensorManager manager = (SensorManager) getSystemService(SENSOR_SERVICE);
        Sensor acelerometro = manager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
        manager.registerListener(this, acelerometro, SensorManager.SENSOR_DELAY_GAME);
        
		//Creates UDP socket to the Raspberry
		socketR = new SocketRobot();
    }
    
	@Override
	public void onSensorChanged(SensorEvent event) 
	{
		//Send coordinates to Raspberry
		socketR.sendCoordinates(event.values[2], event.values[1]);
		
		//Upgrades values in screen
		TextView tvAcelerometroX = (TextView) findViewById(R.id.tvAceleracionX);
		TextView tvAcelerometroY = (TextView) findViewById(R.id.tvAceleracionY);
		TextView tvAcelerometroZ = (TextView) findViewById(R.id.tvAceleracionZ);		
		tvAcelerometroX.setText("" + event.values[0]);
		tvAcelerometroY.setText("" + event.values[1]);
		tvAcelerometroZ.setText("" + event.values[2]);
	}

	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) 
	{
	}
}
