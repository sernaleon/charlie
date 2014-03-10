package asl.clienterobot;

public class RobotFunctions 
{	
	SocketRobot socket;
	SocketRobot client;
	
	public RobotFunctions() 
	{
		socket = new SocketRobot();
		
		new Thread(new SocketClient()).start(); 
	}
	
	public void move(float acceleration, float rotation)
	{
		socket.send(
				DatagramCommands.MOVE_FORWARD, 
				(byte) Utils.map(acceleration,0,90,255,0), 
				(byte) Utils.map(rotation,-90,90,255,0));
	}
	
	public void stop()
	{
		socket.sendWithACK(
				DatagramCommands.STOP,
				DatagramCommands.NOPARAM,
				DatagramCommands.NOPARAM);		
	}
	
	public void beepOn()
	{
		socket.send(
				DatagramCommands.BEEP, 
				DatagramCommands.ON, 
				DatagramCommands.NOPARAM);
	}
	
	public void beepOff()
	{
		socket.send(
				DatagramCommands.BEEP, 
				DatagramCommands.OFF, 
				DatagramCommands.NOPARAM);
	}
}
