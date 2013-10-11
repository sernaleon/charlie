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
	
	/**
	 * Sends a 3 bytes message to the robot
	 * 
	 * @param cmd First byte of the message
	 * @param p1 Second byte of the message
	 * @param p2 Third byte of the message
	 */
	public void send(byte cmd, byte p1, byte p2)
	{
		setDatagram(cmd, p1, p2);
		
    	new Thread(new SendDatagramThread()).start();
	}

	/**
	 * Send the same message the number of times specified in the "times" variable
	 * 
	 * UDP cannot guarantee the message is going to arrive, that's 
	 * why we send some important messages several times
	 * 
	 * @param cmd First byte of the message
	 * @param p1 Second byte of the message
	 * @param p2 Third byte of the message
	 * @param times Number of times that the message will be sent
	 */
	public void sendManyTimes(byte cmd, byte p1, byte p2, int times)
	{
		setDatagram(cmd, p1, p2);
		
		for (int i = 0; i < times; i++)
		{
	    	new Thread(new SendDatagramThread()).start();
		}
	}
	
	/**
	 * Sets the message that will be sent
	 * 
	 * @param cmd First byte of the message
	 * @param p1  Second byte of the message
	 * @param p2  Third byte of the message
	 */
	private void setDatagram(byte cmd, byte p1, byte p2)
	{
		msg[0]= cmd;
		msg[1]= p1;
		msg[2]= p2;
	}
		
	/**
	 * This function is called when the function gets an error trying to send the UDP datagram 
	 * 
	 * @param m Message
	 * @param e Exception
	 */
	private void errorDatagram(String m, Exception e) // throws Exception 
	{
		Log.d("ErrorSocket", m);
//		throw e;
	}
	
	/**
	 * Class for creating a thread that will send the message in the msg variable
	 */
	class SendDatagramThread implements Runnable 
	{
		/**
		 * Sends the msg variable as a UDP datagram 
		 * to the server specified in the GlobalValues class.
		 */
		@Override		
		public void run() 
		{
			try 
			{
				DatagramSocket s = new DatagramSocket();
				InetAddress local = InetAddress.getByName(GlobalValues.SERVER_IP);
				DatagramPacket p = new DatagramPacket(msg, msg.length,local,GlobalValues.SERVER_PORT);	
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
