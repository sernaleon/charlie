package asl.clienterobot;

public class RobotFunctions 
{	
	SocketRobot socket;
	
	public RobotFunctions() 
	{
		socket = new SocketRobot();
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
		socket.sendManyTimes(
				DatagramCommands.STOP,
				DatagramCommands.NOPARAM,
				DatagramCommands.NOPARAM,
				10);		
	}
	
	public void beepOn()
	{
		socket.sendManyTimes(
				DatagramCommands.BEEP, 
				DatagramCommands.ON, 
				DatagramCommands.NOPARAM,
				2);
	}
	
	public void beepOff()
	{
		socket.sendManyTimes(
				DatagramCommands.BEEP, 
				DatagramCommands.OFF, 
				DatagramCommands.NOPARAM,
				2);
	}
}
