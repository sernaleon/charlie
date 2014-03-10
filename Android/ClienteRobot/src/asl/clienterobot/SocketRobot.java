package asl.clienterobot;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import android.util.Log;

public class SocketRobot 
{
	private byte[] msg;
	byte checkNumber;
	boolean receivedACK;
	
	public SocketRobot()
	{
		msg = new byte[4];
		checkNumber = 0;
		receivedACK = false;
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
	public void sendWithACK(byte cmd, byte p1, byte p2)
	{
			setDatagram(cmd, p1, p2);

			
			//Log.d("Cargando receptor UDP", "Cargando receptor UDP");
	
			//new Thread(new ReceiveACK()).start();
						
			//Log.d("Receptor UDP cargado", "Receptor UDP cargado");
			
			//while(!receivedACK)
			for (int i = 0; i < 10 && !receivedACK ; i++)
			{
				//Log.d("Enviando datagrama", "Enviando datagrama");
		    	new Thread(new SendDatagramThread()).start();
				//Log.d("Datagrama enviado", "Datagrama enviado");
			}

			//Log.d("Saliendo", "Saliendo");
			
			//Reset value
			receivedACK = false;

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
		msg[3]= checkNumber;
		
		if (checkNumber >= 255) checkNumber = 0;
		else checkNumber++;
		
		//return checkNumber;
	}
	

	class ReceiveACK implements Runnable
	{
		@Override
		public void run () {
			try {
				byte[] message = new byte[1];
				
				DatagramPacket p = new DatagramPacket(message, message.length);
				DatagramSocket s;
				s = new DatagramSocket(GlobalValues.SERVER_UDP_PORT);
		

				Log.d("Escuchando...","Escuchando...");
				//do 
				//{
					s.receive(p);
				//}
				//while (message[0] != check);
				
					Log.d("ACK RECIBIDO!!!!","ACK RECIBIDO!!!!");
					
				receivedACK = true;
				s.close();
			} catch (Exception e) {
				e.printStackTrace();
				Log.d("ErrorSocket", e.getMessage());
			}
		}
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
				DatagramPacket p = new DatagramPacket(msg, msg.length,local,GlobalValues.SERVER_UDP_PORT);	
				s.send(p);	
				s.close();
    		} 
			catch (Exception e) 
			{
				e.printStackTrace();
				Log.d("ErrorSocket", e.getMessage());
			}
		}
	}
}
