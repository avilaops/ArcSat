import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Registro de usuário
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Email ou senha incorretos"
      });
    }

    // Verificar senha
    const isCorrect = await user.checkPassword(password);
    if (!isCorrect) {
      return res.status(401).json({
        status: "error",
        message: "Email ou senha incorretos"
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message
    });
  }
});

export default router;