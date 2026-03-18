

from dataset_loader import load_dataset
from system_metrics import (
    total_energy_by_system,
    avg_consumption_by_system,
    peak_consumption_by_system,
    min_consumption_by_system,
    energy_by_hour_by_system,
    daily_energy_by_system,
    std_consumption_by_system
)

dataset = load_dataset()

print("\nSYSTEM METRICS TEST\n")

systems = dataset["system_name"].unique()

print("\nTotal energy by system\n")

for system in systems:
    total = total_energy_by_system(dataset, system)
    print(f"{system}: {total} kwh")

print("\nAverage consumption by system\n")

for system in systems:
    avg = avg_consumption_by_system(dataset, system)
    print(f"{system}: {avg} kwh")

print("\nPeak consumption by system\n")

for system in systems:
    peak = peak_consumption_by_system(dataset, system)
    print(f"{system}: {peak} kwh")

print("\nMinimum consumption by system\n")

for system in systems:
    mean = min_consumption_by_system(dataset, system)
    print(f"{system}: {mean} kwh")

print("\nEnergy by hour (per system)\n")

for system in systems:
    print(f"\n{system}")
    result = energy_by_hour_by_system(dataset, system)
    print(result)

print("\nDaily energy by system\n")

for system in systems:
    daily = daily_energy_by_system(dataset, system)
    print(f"\n{system}")
    print(daily)

print("\nConsumption variability (std) by system\n")

for system in systems:
    std = std_consumption_by_system(dataset, system)
    print(f"{system}: {std} kWh")

