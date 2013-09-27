package asl.clienterobot;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.PowerManager;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends Activity implements SensorEventListener {

	SocketRobot s;
	PowerManager pm;
    PowerManager.WakeLock wl;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
    	
    	//Sets view
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        //Sets accelerometer
        SensorManager manager = (SensorManager) getSystemService(SENSOR_SERVICE);
        Sensor acelerometro = manager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        manager.registerListener(this, acelerometro, SensorManager.SENSOR_DELAY_NORMAL);
        
        //Create socket
        //s = new SocketRobot();
        
        Button button = (Button)findViewById(R.id.button1);
        button.setOnClickListener(myhandler1);
        
    }
    
    View.OnClickListener myhandler1 = new View.OnClickListener() {
        public void onClick(View v) {

    		TextView tvAcelerometroZ = (TextView) findViewById(R.id.textView4);
    		tvAcelerometroZ.setText("Creando socket...\n");
        	new Thread(new ClientThread()).start();
    		tvAcelerometroZ.append("En principio ya...\n");

        }
      };
    
	@Override
	public void onSensorChanged(SensorEvent event) {
		

		//s.sendData(event.values[0], event.values[1]);
		
		
		TextView tvAcelerometroX = (TextView) findViewById(R.id.tvAceleracionX);
		TextView tvAcelerometroY = (TextView) findViewById(R.id.tvAceleracionY);
		TextView tvAcelerometroZ = (TextView) findViewById(R.id.tvAceleracionZ);
		
		tvAcelerometroX.setText("" + event.values[0]);
		tvAcelerometroY.setText("" + event.values[1]);
		tvAcelerometroZ.setText("" + event.values[2]);
		

		TextView posicion = (TextView) findViewById(R.id.posicion);
		TextView velocidad = (TextView) findViewById(R.id.velocidad);

		int p = (int) event.values[0];
		int v = (int) event.values[1];
		
		
		posicion.setText(""+(-p));
		
		
		velocidad.setText(""+v);
	}


	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {
		// TODO Auto-generated method stub
		
	}
	
	
	
	class ClientThread implements Runnable {

		@Override
		public void run() {

			try {
	
    			Socket s = new Socket("192.168.0.123",5000);
    			
    			DataOutputStream dout =new DataOutputStream(s.getOutputStream());

    			dout.writeBytes("1");
    	        dout.flush();

    	        dout.close();
    	        s.close();
    			
//    		       
//    	        //outgoing stream redirect to socket
//    	        OutputStream out = s.getOutputStream();
//    	       
//    	        PrintWriter output = new PrintWriter(out);
//    	        output.print(1);
//    
//    	        s.close();
	    	       
	    			
	    			
    		} catch (UnknownHostException e) {
    			// TODO Auto-generated catch block
    			
    			e.printStackTrace();
    		} catch (IOException e) {
    			// TODO Auto-generated catch block
    			e.printStackTrace();
    		}
			catch (Exception e) 
			{
				e.printStackTrace();
			}
		}
	}

}
