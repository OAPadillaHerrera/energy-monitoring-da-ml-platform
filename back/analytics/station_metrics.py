

def total_energy(df):

    return df["consumption_kwh"].sum()

def avg_hourly_consumption(df):

    hourly_totals = df.groupby("timestamp")["consumption_kwh"].sum()

    return hourly_totals.mean()

def peak_demand(df):

    hourly_totals = df.groupby("timestamp")["consumption_kwh"].sum()

    return hourly_totals.max()

def min_demand(df):

    hourly_totals = df.groupby("timestamp")["consumption_kwh"].sum()

    return hourly_totals.min()

def energy_by_hour(dataset):

    hourly = dataset.groupby("timestamp")["consumption_kwh"].sum()

    return hourly

def daily_energy(dataset):

    dataset["date"] = dataset["timestamp"].dt.date

    daily = dataset.groupby("date")["consumption_kwh"].sum()

    return daily

def avg_daily_energy(dataset):

    dataset["date"] = dataset["timestamp"].dt.date

    daily = dataset.groupby("date")["consumption_kwh"].sum()

    return daily.mean()

def energy_by_system(dataset):

    system_energy = dataset.groupby("system_name")["consumption_kwh"].sum()

    return system_energy

def energy_share(dataset):

    system_energy = dataset.groupby("system_name")["consumption_kwh"].sum()

    total = system_energy.sum()

    share = (system_energy / total ) * 100

    return share

def hourly_profile_by_system(dataset):

    profile = dataset.pivot_table(
        index = "timestamp",
        columns = "system_name",
        values = "consumption_kwh",
        aggfunc = "sum"
    )

    return profile

def std_consumption(dataset):

    hourly = dataset.groupby("timestamp")["consumption_kwh"].sum()

    return hourly.std()