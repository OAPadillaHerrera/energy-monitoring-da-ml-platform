

from dataset_loader import load_dataset
from filters import filter_by_date_range
from station_metrics import (
    total_energy,
    avg_hourly_consumption,
    peak_demand,
    min_demand,
    energy_by_hour,
    daily_energy,
    avg_daily_energy,
    energy_by_system,
    energy_share,
    hourly_profile_by_system,
    std_consumption
)

dataset = load_dataset()

print("\nSTATION ENERGY ANALYTICS TEST\n")

df = load_dataset()

df = filter_by_date_range(df, "2026-01-01", "2026-01-01")

total = total_energy(df)
average = avg_hourly_consumption(df)
peak = peak_demand(df)
minimum = min_demand(df)

print("Total energy:", total, "kWh")
print("Average hourly consumption:", average, "kWh")
print("Peak demand:", peak, "kWh")
print("Minimum demand:", minimum, "kWh")

print("\nEnergy by hour\n")

hourly = energy_by_hour(dataset)

print(hourly)

print("\nDaily energy\n")

daily = daily_energy(dataset)

print(daily)

print("\nAverage daily energy\n")

avg_daily = avg_daily_energy(dataset)

print(avg_daily)

print("\nEnergy by system\n")

by_system = energy_by_system(dataset)

print(by_system)

print("\nEnergy share (%)\n")

share = energy_share(dataset)

print(share)

print("\nHourly profile by system\n")

profile = hourly_profile_by_system(dataset)

print(profile)

print("\nConsumption variability (std)\n")

std = std_consumption(dataset)

print(std)
