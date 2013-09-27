package asl.clienterobot;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;


public class SocketRobot {
	private Socket socket;
	private static final int SERVERPORT = 5000;
	private static final String SERVER_IP = "192.168.0.123";
	
	public SocketRobot() throws IOException
	{
		//new Thread(new ClientThread()).start();
		

		InetAddress serverAddr = InetAddress.getByName(SERVER_IP);
 
		socket = new Socket(serverAddr, SERVERPORT);
	}
	
	public void sendData(String msg) throws IOException
	{
		PrintWriter out = new PrintWriter(new BufferedWriter(
				new OutputStreamWriter(socket.getOutputStream())),
				true);
		out.println(msg);
	}
		
//	public void sendData(float x, float y)
//	{
//		try 
//		{
//			PrintWriter out = new PrintWriter(new BufferedWriter(
//					new OutputStreamWriter(socket.getOutputStream())),
//					true);
//			out.println(encode(x)+"-"+encode(y));
//		} 
//		catch (Exception e) 
//		{
//			e.printStackTrace();
//		}
//	}
//	
//	
//	
//	
//	public int encode(float inp)
//	{
//		float aux= 10 + (inp * 10);	
//		
//		if (aux < 0) aux = 0;
//		else if (aux > 20) aux  = 20;
//		
//		return (int) aux;
//	}
//	
//	
//	class ClientThread implements Runnable {
//
//		@Override
//		public void run() {
//
//			try {
//				InetAddress serverAddr = InetAddress.getByName(SERVER_IP);
//
//				socket = new Socket(serverAddr, SERVERPORT);
//
//			} 
//			catch (Exception e) 
//			{
//				e.printStackTrace();
//			}
//		}
//	}
}
