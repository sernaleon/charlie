package asl.clienterobot;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.UnknownHostException;
import android.util.Log;

public class SocketRobot 
{
	private static final int SERVERPORT = 5000;
	private static final String SERVER_IP = "192.168.0.123";
	private byte[] msg;
	
	public void sendCoordinates(float acceleration, float rotation)
	{	
		msg = new byte[3];
		msg[0]= 1;
		msg[1]= (byte) Utils.map(acceleration,0,90,255,0);
		msg[2]= (byte) Utils.map(rotation,-90,90,255,0);
    	new Thread(new SendDatagramThread()).start();
	}
	
	public void sendData(byte[] datagram)
	{
		msg = datagram;
    	new Thread(new SendDatagramThread()).start();
	}
	
	private void errorDatagram(String m, Exception e) // throws Exception 
	{
		Log.d("ErrorSocket", m);
//		throw e;
	}
	
	class SendDatagramThread implements Runnable 
	{
		@Override
		public void run() 
		{
			try 
			{
				DatagramSocket s = new DatagramSocket();
				InetAddress local = InetAddress.getByName(SERVER_IP);
				DatagramPacket p = new DatagramPacket(msg, msg.length,local,SERVERPORT);	
				s.send(p);	
				s.close();
    		} 
			catch (UnknownHostException e) 
    		{
				errorDatagram("UnknownHostException",e);
    		} 
			catch (IOException e) 
    		{
				errorDatagram("IOException",e);
    		}
			catch (Exception e) 
			{
				errorDatagram("Exception",e);
			}
		}
	}
}
