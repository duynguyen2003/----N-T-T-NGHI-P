/**
 * ============================================================
 * FILE: controllers/labController.js
 * PURPOSE: Handle lab/practical exercise management
 * TASKS: Task 1.5 - Content Management Service
 * STATUS: Stub
 * ============================================================
 */

const getLabsByCourse = async (req, res, next) => {
  try {
    res.json({ success: false, message: 'Not implemented - Task 1.5' });
  } catch (error) {
    next(error);
  }
};

const getLabById = async (req, res, next) => {
  try {
    res.json({ success: false, message: 'Not implemented - Task 1.5' });
  } catch (error) {
    next(error);
  }
};

const createLab = async (req, res, next) => {
  try {
    res.status(201).json({ success: false, message: 'Not implemented - Task 1.5' });
  } catch (error) {
    next(error);
  }
};

const updateLab = async (req, res, next) => {
  try {
    res.json({ success: false, message: 'Not implemented - Task 1.5' });
  } catch (error) {
    next(error);
  }
};

const deleteLab = async (req, res, next) => {
  try {
    res.json({ success: false, message: 'Not implemented - Task 1.5' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLabsByCourse,
  getLabById,
  createLab,
  updateLab,
  deleteLab
};
