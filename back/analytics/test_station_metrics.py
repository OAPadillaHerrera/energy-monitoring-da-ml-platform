

from dataset_loader import load_dataset
from filters import filter_by_date_range
from station_metrics import (
    total_energy,
    avg_hourly_consumption,
    peak_demand,
    min_demand,
    energy_by_hour
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