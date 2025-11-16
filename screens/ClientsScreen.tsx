
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const ClientsScreen: React.FC = () => {
    const { clients } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = useMemo(() =>
        clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm)
        ),
        [clients, searchTerm]
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-brand-accent mb-6">Müşteri Kayıtları</h1>
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Müşteri Ara (İsim veya Telefon)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 bg-brand-secondary border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="space-y-4">
                {filteredClients.length > 0 ? filteredClients.map(client => (
                    <div key={client.id} className="bg-brand-secondary p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-brand-light">{client.name}</h3>
                            <a href={`tel:${client.phone}`} className="text-brand-accent hover:underline">
                                {client.phone}
                            </a>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{client.notes || 'Müşteri notu yok.'}</p>
                        <p className="text-xs text-right text-gray-500 mt-2">
                           Son Ziyaret: {client.lastVisit.toLocaleDateString('tr-TR')}
                        </p>
                    </div>
                )) : (
                    <p className="text-center text-gray-400 mt-8">Aramanızla eşleşen müşteri bulunamadı.</p>
                )}
            </div>
        </div>
    );
};

export default ClientsScreen;
