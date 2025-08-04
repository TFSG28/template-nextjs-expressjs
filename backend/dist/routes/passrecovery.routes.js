"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passrecovery_controller_1 = require("../controllers/passrecovery.controller");
const router = (0, express_1.Router)();
router.post('/', passrecovery_controller_1.passwdRecovery);
router.put('/', passrecovery_controller_1.resetPassword);
exports.default = router;
