package asl.clienterobot;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.UnknownHostException;
import android.util.Log;

public class SocketRobot 
{
	private byte[] msg;
	
	public SocketRobot()
	{
		msg = new byte[3];
	}
	
	public void sendCoordinates(float acceleration, float rotation)
	{	
			setDatagram(
					DatagramCommands.MOVE_FORWARD, 
					(byte) Utils.map(acceleration,0,90,255,0), 
					(byte) Utils.map(rotation,-90,90,255,0));
			
	    	new Thread(new SendDatagramThread()).start();
	}
	
	public void stop()
	{
		setDatagram(
				DatagramCommands.STOP,
				DatagramCommands.NOPARAM,
				DatagramCommands.NOPARAM);
		
		//UDP cannot guarantee the message is going to arrive, that's why we send it 10 times
		for (int i = 0; i < 10; i++)
		{
	    	new Thread(new SendDatagramThread()).start();
		}
	}
	
	private void setDatagram(byte cmd, byte p1, byte p2)
	{
		msg[0]= cmd;
		msg[1]= p1;
		msg[2]= p2;
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
				InetAddress local = InetAddress.getByName(GlobalValues.SERVER_IP);
				DatagramPacket p = new DatagramPacket(msg, msg.length,local,GlobalValues.SERVERPORT);	
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
