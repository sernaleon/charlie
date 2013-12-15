package asl.clienterobot;

import java.net.DatagramPacket;
import java.net.DatagramSocket;

import android.util.Log;

public class SocketClient implements Runnable {
	
	public byte msg;

	@Override
	public void run () {
		try {
			byte[] message = new byte[1];
			
			DatagramPacket p = new DatagramPacket(message, message.length);
			DatagramSocket s;
			s = new DatagramSocket(GlobalValues.SERVER_UDP_PORT);

			do 
			{
				Log.d("Escuchando...","Escuchando...");
				s.receive(p);
				msg = message[0];
			    Log.d("ACK RECIBIDO!!!!"+message[0],"ACK RECIBIDO!!!!"+message[0]);
			}
			while (true);
			
				
				
			//s.close();
		} catch (Exception e) {
			e.printStackTrace();
			Log.d("ErrorSocket", e.getMessage());
		}
	}
}
