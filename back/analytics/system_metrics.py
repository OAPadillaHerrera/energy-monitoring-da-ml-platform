

from filters import filter_by_system

def total_energy_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    return system_data["consumption_kwh"].sum()

def avg_consumption_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    return system_data["consumption_kwh"].mean()

def peak_consumption_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    return system_data["consumption_kwh"].max()

def min_consumption_by_system(dataset, system_name):

    system_data = filter_by_system(dataset, system_name)

    return system_data["consumption_kwh"].min()
