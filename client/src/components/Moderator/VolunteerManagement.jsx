import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { store } from "../../stores/store";
import { motion } from "framer-motion";

const VolunteerManagement = observer(() => {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        const fetchVolunteers = async () => {
            const data = await store.getVolunteers();
            if (data) {
                setVolunteers(data);
            }
        };
        fetchVolunteers();
    }, []);

    const handleApprove = async (id) => {
        console.log(id);
        await store.approveVolunteer(id);
        const updatedVolunteers = await store.getVolunteers();
        if (updatedVolunteers) {
            setVolunteers(updatedVolunteers);
        }
    };

    const handleReject = async (id) => {
        await store.rejectVolunteer(id);
        const updatedVolunteers = await store.getVolunteers();
        if (updatedVolunteers) {
            setVolunteers(updatedVolunteers);
        }
    };

    const handleDelete = async (id) => {
        await store.deleteVolunteer(id);
        const updatedVolunteers = await store.getVolunteers();
        if (updatedVolunteers) {
            setVolunteers(updatedVolunteers);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
        >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Управление волонтерами</h2>
            <div className="space-y-4">
                {volunteers.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">Нет активных заявок на волонтерство</p>
                ) : (
                    volunteers.map((volunteer) => (
                        <div key={volunteer._id} className="p-4 border border-gray-100 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {volunteer.userId.username}
                                    </h3>
                                    <p className="text-sm text-gray-600">{volunteer.userId.email}</p>
                                    <p className="text-sm text-gray-600">Статус: {volunteer.status}</p>
                                </div>
                                <div className="flex space-x-2">
                                    {volunteer.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(volunteer._id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                                            >
                                                Одобрить
                                            </button>
                                            <button
                                                onClick={() => handleReject(volunteer._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                            >
                                                Отклонить
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(volunteer._id)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
});

export default VolunteerManagement;