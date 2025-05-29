import {Router} from 'express';
import {authRequired} from '../middlewares/validateToken.js';
import {getEquipments,
        createEquipment,
        deleteEquipment,
        updateEquipment,
        getEquipmentById} from '../controllers/equipments.controller.js';
import validateRequest from '../middlewares/validator.middleware.js';
import {roleRequired} from '../middlewares/roleRequired.js';
import {createEquipmentSchema} from '../schemas/equipment.schema.js';
import {upload} from '../middlewares/upload.js';

const router = Router();

router.get('/equipments', getEquipments);

router.get('/equipments/:id', getEquipmentById);

// Solo admins pueden crear equipos
router.post('/equipments', authRequired, roleRequired('admin'), upload.single('image'), ...createEquipmentSchema, validateRequest,  createEquipment);

// Solo admins pueden eliminar equipos
router.delete('/equipments/:id', authRequired, roleRequired('admin'), deleteEquipment);

// Solo admins pueden actualizar equipos
router.put('/equipments/:id', authRequired, roleRequired('admin'), updateEquipment);

export default router;