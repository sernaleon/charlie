package asl.clienterobot;

import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends Activity implements SensorEventListener 
{
	boolean activeSocket;
	SocketRobot socketR;
	
	SensorManager manager;
	Sensor acelerometro;
	
    @Override
    public void onCreate(Bundle savedInstanceState) 
    {
    	//Sets view
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        //Sets button
        Button button = (Button)findViewById(R.id.button1);
        button.setOnClickListener(myhandler1);
        
        //Sets accelerometer
        manager = (SensorManager) getSystemService(SENSOR_SERVICE);
        acelerometro = manager.getDefaultSensor(Sensor.TYPE_ORIENTATION);        
        
		//Creates UDP socket to the Raspberry
		socketR = new SocketRobot();
        activeSocket = false;
    }
    
    private void activateSensors()
    {
        manager.registerListener(this, acelerometro, SensorManager.SENSOR_DELAY_GAME);
		activeSocket = true;
    }
    
    private void desactivateSensors()
    {
		manager.unregisterListener(this);
		activeSocket = false;
    }
    
    
    View.OnClickListener myhandler1 = new View.OnClickListener() 
    {
    	public void onClick(View v) 
    	{
    		if (activeSocket)
    		{
    			socketR.stop();
    			desactivateSensors();
    		}
    		else
    		{
    			activateSensors();
    		}
    	}
    };

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
