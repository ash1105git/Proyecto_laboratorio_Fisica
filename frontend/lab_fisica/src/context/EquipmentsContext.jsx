import { createContext, useContext, useState } from "react";
import {
    createEquipmentRequest,
    getEquipmentsRequest,
    deleteEquipmentRequest,
    getEquipmentRequest,
    updateEquipmentRequest
} from "./api/equipments";

const EquipmentsContext = createContext();

export const useEquipments = () => {
    const context = useContext(EquipmentsContext);
    if (!context) {
        throw new Error("useEquipments must be used within an EquipmentsProvider");
    }
    return context;
}
export function EquipmentsProvider({ children }) {
    const [equipments, setEquipments] = useState([]);


    const getEquipments = async () => {
        try {
            const res = await getEquipmentsRequest();
            setEquipments(res.data);
        } catch (error) {
            console.error("Error fetching equipments:", error);
        }
    }

    const addEquipment =  async (equipment) => {
        console.log(`equipment!`);
        const res = await createEquipmentRequest(equipment);
        console.log(res);
    }

    const deleteEquipment = async (id) => {
       
        try {
            const res = await deleteEquipmentRequest(id);
            if (res.status === 200 ) {
      setEquipments(prevEquipments => 
        prevEquipments.filter((equipment) => equipment._id !== id)
      );
    } 
            
        } catch (error) {
            console.error("Error deleting equipment:", error);
        }
        // Aquí puedes agregar la lógica para eliminar el equipo
    }

    const getEquipment = async (id) => {
     try {
            const res = await getEquipmentRequest(id);
            return res.data;
     } catch (error) {
         console.error("Error fetching equipment:", error);
         return null;
     }
    }

    const updateEquipment = async (id, equipment) => {

        try {

            await updateEquipmentRequest(id, equipment);
                        
        } catch (error) {
            console.error("Error updating equipment:", error);
        }
    }

    
    return (
        <EquipmentsContext.Provider
            value={{
                equipments,
                addEquipment,
                getEquipments,
                deleteEquipment,
                getEquipment,
                updateEquipment
            }}>
            {children}
        </EquipmentsContext.Provider>
    );
    }