import React, { useState, useEffect } from "react";
import { X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../ui/Toast";
import { CATEGORIES } from "../../data/transactions";
import { format } from "date-fns";

function validate(form) {
  const errors = {};
  if (!form.description.trim()) errors.description = "Description is required";
  if (!form.amount) errors.amount = "Amount is required";
  else if (isNaN(Number(form.amount))) errors.amount = "Must be a valid number";
  else if (Number(form.amount) <= 0) errors.amount = "Amount must be greater than 0";
  if (!form.date) errors.date = "Date is required";
  return errors;
}

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp();
  const toast = useToast();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "FOOD",
    type: "expense",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: String(transaction.amount),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
      });
    }
  }, [transaction]);

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...form, [field]: value });
      setErrors((e) => ({ ...e, [field]: newErrors[field] }));
    }
  };

  const handleSubmit = () => {
    const allTouched = { description: true, amount: true, date: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      id: isEdit ? transaction.id : Date.now(),
      description: form.description.trim(),
      amount: Math.round(Number(form.amount)),
      category: form.category,
      type: form.type,
      date: form.date,
      categoryData: CATEGORIES[form.category],
    };

    if (isEdit) {
      dispatch({ type: "EDIT_TRANSACTION", payload });
      toast("Transaction updated successfully", "success");
    } else {
      dispatch({ type: "ADD_TRANSACTION", payload });
      toast("Transaction added successfully", "success");
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isEdit ? "Edit Transaction" : "Add Transaction"}</div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Type toggle */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-toggle">
            <div
              className={`type-option ${form.type === "income" ? "income-active" : ""}`}
              onClick={() => handleChange("type", "income")}
            >
              <ArrowUpCircle size={14} strokeWidth={2} />
              Income
            </div>
            <div
              className={`type-option ${form.type === "expense" ? "expense-active" : ""}`}
              onClick={() => handleChange("type", "expense")}
            >
              <ArrowDownCircle size={14} strokeWidth={2} />
              Expense
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className={`form-input ${touched.description && errors.description ? "input-error" : ""}`}
            placeholder="e.g. Salary, Grocery, Netflix..."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => touch("description")}
            autoFocus
          />
          {touched.description && errors.description && (
            <div className="field-error">{errors.description}</div>
          )}
        </div>

        {/* Amount + Date */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              className={`form-input ${touched.amount && errors.amount ? "input-error" : ""}`}
              type="number"
              placeholder="0"
              min="0"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              onBlur={() => touch("amount")}
            />
            {touched.amount && errors.amount && (
              <div className="field-error">{errors.amount}</div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className={`form-input ${touched.date && errors.date ? "input-error" : ""}`}
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              onBlur={() => touch("date")}
            />
            {touched.date && errors.date && (
              <div className="field-error">{errors.date}</div>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            style={{ background: "var(--bg-input)" }}
          >
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
