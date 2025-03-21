// Packages.tsx
import { Plus } from "lucide-react";

interface Package {
  id: string;
  destinatario: string;
  direccion: string;
  estado: string;
  fechaCreacion: string;
  fechaEntrega: string;
}

interface PackagesProps {
  packages: Package[];
}

const estadoColors: Record<string, string> = {
  Pendiente: "bg-yellow-100 text-yellow-800",
  "En preparación": "bg-blue-100 text-blue-800",
  "En tránsito": "bg-purple-100 text-purple-800",
  Entregado: "bg-green-100 text-green-800",
};

const Packages: React.FC<PackagesProps> = ({ packages }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Gestión de Paquetes</h2>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Paquete
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinatario</th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Entrega</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">{pkg.id}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{pkg.destinatario}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{pkg.direccion}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoColors[pkg.estado]}`}>
                    {pkg.estado}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {pkg.fechaEntrega}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Packages;
