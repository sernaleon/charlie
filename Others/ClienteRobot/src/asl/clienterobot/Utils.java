package asl.clienterobot;

public class Utils {

	/*** 
	 * Re-maps a number from one range to another. That is, a value of fromLow would get mapped 
	 * to toLow, a value of fromHigh to toHigh, values in-between to values in-between, etc.
	 * 
	 * Does not constrain values to within the range, because out-of-range values are sometimes 
	 * intended and useful. The constrain() function may be used either before or after this 
	 * function, if limits to the ranges are desired.
	 * 
	 * Note that the "lower bounds" of either range may be larger or smaller than the 
	 * "upper bounds" so the map() function may be used to reverse a range of numbers.
	 * 
	 * This function is based in the 'map' function of Arduino:
	 * http://arduino.cc/en/Reference/map
	 * 
	 * @param x The number to map
	 * @param in_min  The lower bound of the value's current range
	 * @param in_max  The upper bound of the value's current range
	 * @param out_min The  lower bound of the value's target range
	 * @param out_max The upper bound of the value's target range
	 * @return Valor The mapped value
	 */
	public static final float map(float x, float in_min, float in_max, float out_min, float out_max)
	{
	  if 		(x < in_min) x = in_min;
	  else if 	(x > in_max) x = in_max;
	  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}
}
