#include <WiFi.h>
#include <PubSubClient.h>

// Pin del LED
const byte led_gpio = 33;

// Nombre del cliente y tópico MQTT donde se publicarán los mensajes
const char *clientName = "ESP32";
const char *topicLed = "esp32/led";

// Credenciales de la red WiFi a la que se conectará el módulo
const char *ssid = "SSID";
const char *password = "PASSWORD";

// Dirección IP del broker MQTT
const char *mqttServer = "10.10.20.57";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // Inicializa la conexión serial y espera a que se establezca la conexión
  Serial.begin(9600);

  // Configurar pin LED
  pinMode(led_gpio, OUTPUT);

  // Conecta el módulo ESP32 a la red WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Conectando a WiFi..");
  }
  Serial.println("Conectado a WiFi");

  // Configura el cliente MQTT y conéctelo al broker
  client.setServer(mqttServer, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    connectMqtt();
  }
  client.loop();
}

void connectMqtt() {
  while (!client.connected()) {
    if (client.connect(clientName)) {
      Serial.println("Conectado al broker MQTT");
      client.subscribe(topicLed);
      client.publish(topicLed, "Conectado al topic esp32/led");
    } else {
      Serial.print("Error al conectar al broker MQTT, rc=");
      Serial.print(client.state());
      Serial.println(" Reintentando en 5 segundos");
      delay(5000);
    }
  }
}

// Función de callback para manejar mensajes recibidos del broker MQTT
void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Mensaje recibido del tópico [");
  Serial.print(topic);
  Serial.print("] ");

  String message = "";
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    message += (char)payload[i];
  }

  Serial.print(message);
  if (message == "/ledOn") {
    digitalWrite(led_gpio, HIGH);
  } else if (message == "/ledOff") {
    digitalWrite(led_gpio, LOW);
  }

  Serial.println();
}
