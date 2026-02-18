#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("Temperature (°C)     Moisture (%)");
  Serial.println("--------------------------------");
}

void loop() {
  float moisture = dht.readHumidity();
  float temperature = dht.readTemperature(); // Celsius

  if (isnan(moisture) || isnan(temperature)) {
    Serial.println("Sensor read error");
    return;
  }

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print(" °C");

  // spacing for alignment
  if (temperature < 10) Serial.print("      ");
  else Serial.print("     ");

  Serial.print("Moisture: ");
  Serial.print(moisture);
  Serial.println(" %");

  delay(2000);
}
