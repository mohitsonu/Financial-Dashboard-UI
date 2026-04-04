import { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import styles from './AddTransactionModal.module.css';

const FUND_OPTIONS = [
  'Client Invoice - New Client',
  'Salary Disbursement - Monthly',
  'AWS Monthly - Cloud Infrastructure',
  'Google Workspace - SaaS Subscription',
  'WeWork Co-working - Office Rent',
  'Meta Ads - Digital Marketing',
  'GST Payment - Tax Filing',
  'Razorpay Settlement - Collections',
  'Vendor Payout - Professional Services',
  'Chartered Accountant - Audit Fees',
];

// `editTxn` is passed when editing an existing transaction, null when adding new
export default function AddTransactionModal({ onClose, editTxn = null }) {
  const { dispatch } = usePortfolio();
  const isEdit = editTxn !== null;

  const [form, setForm] = useState({
    fundName: editTxn?.fundName || FUND_OPTIONS[0],
    type: editTxn?.type || 'Invoice',
    amount: editTxn?.amount?.toString() || '',
    date: editTxn?.date || new Date().toISOString().split('T')[0],
    status: editTxn?.status || 'completed',
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errs.amount = 'Please enter a valid amount';
    }
    if (!form.date) {
      errs.date = 'Date is required';
    }
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isEdit) {
      dispatch({
        type: 'EDIT_TRANSACTION',
        payload: {
          id: editTxn.id,
          fundName: form.fundName,
          type: form.type,
          date: form.date,
          amount: Number(form.amount),
          status: form.status,
        },
      });
    } else {
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: `txn_${Date.now()}`,
          fundName: form.fundName,
          type: form.type,
          date: form.date,
          amount: Number(form.amount),
          status: form.status,
        },
      });
    }

    onClose();
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={styles.modalTitle}>
              {isEdit ? 'Edit Transaction' : 'Add Transaction'}
            </span>
            <span className={styles.adminBadge}>
              <ShieldCheck size={11} />
              Admin
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <select
                name="fundName"
                className={styles.select}
                value={form.fundName}
                onChange={handleChange}
              >
                {FUND_OPTIONS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Type</label>
                <select name="type" className={styles.select} value={form.type} onChange={handleChange}>
                  <option value="Invoice">Invoice</option>
                  <option value="Payout">Payout</option>
                  <option value="Recurring">Recurring</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select name="status" className={styles.select} value={form.status} onChange={handleChange}>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  className={styles.input}
                  placeholder="e.g. 5000"
                  value={form.amount}
                  onChange={handleChange}
                  min="1"
                />
                {errors.amount && <span className={styles.error}>{errors.amount}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Date</label>
                <input
                  type="date"
                  name="date"
                  className={styles.input}
                  value={form.date}
                  onChange={handleChange}
                />
                {errors.date && <span className={styles.error}>{errors.date}</span>}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
