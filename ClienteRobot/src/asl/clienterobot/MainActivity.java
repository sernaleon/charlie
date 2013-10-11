package asl.clienterobot;

import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends Activity implements SensorEventListener 
{
	boolean isMoving;
	RobotFunctions robotFunctions;
	
	Button buttonMove;
	Button buttonBeep;
	
	SensorManager manager;
	Sensor orientationSensor;
	
    @Override
    public void onCreate(Bundle savedInstanceState) 
    {
    	//Sets view
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        //Sets move button
        buttonMove = (Button)findViewById(R.id.buttonMove);
        buttonMove.setOnClickListener(btnMove);

        //Sets beep button
        buttonBeep = (Button)findViewById(R.id.buttonBeep);
        buttonBeep.setOnTouchListener(btnTouch);
        
        //Sets accelerometer
        manager = (SensorManager) getSystemService(SENSOR_SERVICE);
        orientationSensor = manager.getDefaultSensor(Sensor.TYPE_ORIENTATION);        
        
		//Creates instance to robot functions
		robotFunctions = new RobotFunctions();
        isMoving = false;
    }
    
    private void activateSensors()
    {
        manager.registerListener(this, orientationSensor, SensorManager.SENSOR_DELAY_GAME);
		isMoving = true;
		buttonMove.setText("Stop");
    }
    
    private void desactivateSensors()
    {
		manager.unregisterListener(this);
		isMoving = false;
		buttonMove.setText("Start");
    }
    
    View.OnClickListener btnMove = new View.OnClickListener() 
    {
    	public void onClick(View v) 
    	{
    		if (isMoving)
    		{
    			robotFunctions.stop();
    			desactivateSensors();
    		}
    		else
    		{
    			activateSensors();
    		}
    	}
    };
    
    View.OnTouchListener btnTouch = new View.OnTouchListener() 
    {
        @Override
        public boolean onTouch(View v, MotionEvent event) 
        {
            int action = event.getAction();
            
            if (action == MotionEvent.ACTION_DOWN)
            {
            	robotFunctions.beepOn();
            }
            else if (action == MotionEvent.ACTION_UP)
            {
            	robotFunctions.beepOff();
            }
            return false;  
        }
    };

	@Override
	public void onSensorChanged(SensorEvent event) 
	{
		//Send coordinates to Raspberry
		robotFunctions.move(event.values[2], event.values[1]);
		
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
