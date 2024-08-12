from qiskit import QuantumCircuit
from qiskit.primitives import Sampler
from qiskit.visualization import plot_histogram

qc = QuantumCircuit(2)
qc.h(0)
qc.measure_all()
results = Sampler().run(qc, shots=1000, seed=0).result()
statistics = results.quasi_dists[0].binary_probabilities()
plot_histogram(statistics, filename=str("histogram"), bar_labels=False)
print(statistics)
