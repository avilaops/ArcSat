import express from "express";
import axios from "axios";
import Company from "../models/Company.js";

const router = express.Router();

router.get("/:cnpj", async (req, res) => {
  try {
    const { cnpj } = req.params;
    const { data } = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    const company = await Company.findOneAndUpdate({ cnpj }, data, { upsert: true, new: true });
    res.json(company);
  } catch (err) {
    res.status(400).json({ error: "CNPJ inválido ou não encontrado." });
  }
});

export default router;
