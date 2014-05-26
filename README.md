Charlie the robot
=======

Charlie es un robot polivalente que puede ser controlado tanto desde una aplicación Android como desde una página web. El cerebro del robot está construido sobre una Raspberry Pi, que junto a una placa Arduino Due se encargan de dirigir una serie de sensores, motores, leds, y otros muchos elementos, además de gestionar las conexiones de red. 

![](https://dl.dropboxusercontent.com/u/36785744/Charlie/Charlie.jpg)

### Elementos disponibles

El robot dispone de los siguientes elementos:

 * 2 **motores** CC que permiten desplazar el robot.
 * 1 **cámara** de vídeo.
 * 1 **sonar** (módulo de ultrasonidos SR04).
 * 1 **servomotor** que controla la inclinación vertical de la cámara y el sonar.
 * 21 sensores **infrarrojos** CNY70 para detectar marcas en el suelo.
   * 12 de ellos realizan una lectura analógica.
   * 9 devuelven un valor booleano, indicando si la marca leída es negra o no.
 * 15 **leds**
   * 14 pueden ser controlados por el usuario.
   * 1 led de control.
 * 1 **claxon** (también llamado zumbador, piezoeléctico, o buzzer)
 * Adaptador **Wi-Fi** capaz de crear redes Ad Hoc (y por supuesto, conectarse a redes ya existentes).

### Modos de control

Charlie tiene dos formas de ser controlado.

#### _Drive_: Modo de conducción libre

Mediante esta modalidad de control, el robot es capaz de desplazarse y realizar una transmisión de vídeo en tiempo real. Desde una aplicación Android es posible controlar el desplazamiento del robot empleando el acelerómetro del móvil. La inclinación hacia adelante y hacia atrás del dispositivo Android determina la velocidad del robot. Las inclinaciones laterales indican el ángulo de giro del robot.

En la pantalla del dispositivo Android aparece la señal de la cámara del robot en tiempo real, siendo posible controlar la inclinación vertical de la cámara mediante una barra deslizante.

Esta forma de control del robot puede recordar a la de un vehículo teledirigido de altas prestaciones, ya que ademas de controlar su movimiento mediante una innovadora forma de control, es posible ver en tiempo real la señal de la cámara y controlar su inclinación vertical. Por otra parte, este robot puede ser controlado desde cualquier parte del universo (que disponga de conexión a Internet) gracias a que la comunicación es realizada sobre una red Wi-Fi.

#### _Code_: Modo de programación gráfica

El modo de programación se trata de un lenguaje de programación gráfico (basado en el lenguaje Blockly) que permite programar el comportamiento del robot mediante bloques. Esta forma de control está disponible tanto desde la aplicación Android como desde una página web. 

Un sencillo ejemplo de podría ser: avanza, y cuando detectes un objeto a 20cm o menos, detente.

![](https://dl.dropboxusercontent.com/u/36785744/Charlie/sonar.PNG)

Esta forma de control pretende proporcionar las herramientas necesarias para que cualquier persona, sin
que tenga conocimientos específicos de programación, pueda construir comportamientos del robot, e iniciarse en el mundo de la programación mediante unas prácticas de aprendizaje basadas en la experimentación. Una gran ventaja de la programación gráfica es que no es posible cometer error sintácticos, por lo que el programador novel puede centrar todos sus esfuerzos en el aspecto lógico de la programación.

Aunque se ha dedicado mucho esfuerzo en simplificar al máximo este lenguaje, esto no lo hace menos funcional. Los programadores ya iniciados también pueden sacar un gran partido de este lenguaje, y crear comportamientos avanzados, como por ejemplo que el robot realice automáticamente un recorrido por casa siguiendo unas lineas marcadas en el suelo, mientras el programador se encuentra en otro lugar (pongamos, el Caribe) viendo la señal de la cámara y controlado que todo está en orden cuando él no se encuentra físicamente en su hogar. 

# Más información

Para conocer más acerca de este proyecto, se pone a disposición del lector una documentación detallada, en el [apartado Wiki de  GitHub](https://github.com/monkeyserna/charlie/wiki)
