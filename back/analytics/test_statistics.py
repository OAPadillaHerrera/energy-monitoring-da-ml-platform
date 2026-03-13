

from basic_statistics import (
    total_consumption,
    average_consumption,
    consumption_by_system,
    consumption_by_hour
)

print("\nENERGY ANALYTICS TEST\n")

total = total_consumption()
print(f"Total consumption: {total} kWh")

average = average_consumption()
print(f"Average consumption: {average} kWh")

print("\nConsumption by system\n")

system_consumption = consumption_by_system()
print(system_consumption)

print("\nConsumption by hour\n")

hourly_consumption = consumption_by_hour()
print(hourly_consumption)