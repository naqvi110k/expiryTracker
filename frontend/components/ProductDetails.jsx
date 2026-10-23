import React, { useState, useCallback } from 'react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import {
  AlertTriangle,
  CheckCircle,
  Edit,
  Info,
  Layers,
  MessageCircle,
  ShieldCheck,
  Tag,
  Trash2,
  XCircle
} from 'lucide-react';
import { sendExpiryAlert, sendTelegramAlert } from '../services/productService';

const ALERT_RESET_DELAY = 3000;

const ProductDetails = ({
  product,
  onEdit,
  onDelete,
  onAlertSent,
  darkMode = false
}) => {
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [telegramSent, setTelegramSent] = useState(false);
  const [whatsappError, setWhatsappError] = useState(false);
  const [telegramError, setTelegramError] = useState(false);

  const resetAlertState = useCallback((type) => {
    setTimeout(() => {
      if (type === 'whatsapp') {
        setWhatsappSent(false);
        setWhatsappError(false);
      } else {
        setTelegramSent(false);
        setTelegramError(false);
      }
    }, ALERT_RESET_DELAY);
  }, []);

  const handleSendWhatsAppAlert = useCallback(async () => {
    setWhatsappLoading(true);
    setWhatsappError(false);
    try {
      await sendExpiryAlert(product.id);
      setWhatsappSent(true);
      onAlertSent?.('success', `WhatsApp alert sent for ${product.name}`);
      resetAlertState('whatsapp');
    } catch (error) {
      setWhatsappError(true);
      onAlertSent?.('error', `Failed to send WhatsApp alert: ${error.message || 'Unknown error'}`);
      resetAlertState('whatsapp');
    } finally {
      setWhatsappLoading(false);
    }
  }, [product.id, product.name, onAlertSent, resetAlertState]);

  const handleSendTelegramAlert = useCallback(async () => {
    setTelegramLoading(true);
    setTelegramError(false);
    try {
      await sendTelegramAlert(product.id);
      setTelegramSent(true);
      onAlertSent?.('success', `Telegram alert sent for ${product.name}`);
      resetAlertState('telegram');
    } catch (error) {
      setTelegramError(true);
      onAlertSent?.('error', `Failed to send Telegram alert: ${error.message || 'Unknown error'}`);
      resetAlertState('telegram');
    } finally {
      setTelegramLoading(false);
    }
  }, [product.id, product.name, onAlertSent, resetAlertState]);

  const getStatusDetails = useCallback((dateString) => {
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: 'Expired',
        variant: 'destructive',
        icon: <XCircle className="h-4 w-4" />,
        msg: `Expired ${Math.abs(diffDays)} days ago`,
        urgency: 'critical'
      };
    }
    if (diffDays <= 30) {
      return {
        label: 'Expiring Soon',
        variant: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        msg: `Expires in ${diffDays} days`,
        urgency: 'warning'
      };
    }
    return {
      label: 'Healthy Stock',
      variant: 'success',
      icon: <CheckCircle className="h-4 w-4" />,
      msg: `Valid for ${diffDays} more days`,
      urgency: 'good'
    };
  }, []);

  const getStatusMessage = useCallback((urgency) => {
    switch (urgency) {
      case 'critical':
        return 'This batch has passed its expiration date and should be removed from active shelves immediately.';
      case 'warning':
        return 'This batch is within its 30-day window. Pull to the front row (FEFO), apply a clearance discount, or initiate a distributor return.';
      default:
        return 'This batch has healthy remaining shelf life and can remain in standard rotation.';
    }
  }, []);

  const status = getStatusDetails(product.expiryDate);
  const imageSrc = product.imageUrl || product.image || '/api/placeholder/400/400';

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
      {/* Header Summary Card */}
      <div
        className={`rounded-xl border p-5 sm:p-6 ${
          darkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-white'
        }`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" darkMode={darkMode}>
                <Layers size={11} />
                <span>{product.category || 'Uncategorized'}</span>
              </Badge>
              {product.brand && (
                <Badge variant="outline" darkMode={darkMode}>
                  <Tag size={11} />
                  <span>{product.brand}</span>
                </Badge>
              )}
              <Badge variant={status.variant} darkMode={darkMode}>
                {status.icon}
                <span>{status.label}</span>
              </Badge>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
              {product.name}
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
              {product.description || 'No additional notes recorded for this batch. Active FEFO monitoring is enabled.'}
            </p>
          </div>

          <div
            className={`rounded-lg border p-4 lg:min-w-[260px] ${
              darkMode ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#E4E4E0] bg-[#FAF9F6]'
            }`}
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#767670]">
              Countdown Status
            </div>
            <div className="mt-1 tabular-data text-xl font-bold">
              {status.msg}
            </div>
            <div className={`mt-1.5 text-xs leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
              {getStatusMessage(status.urgency)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Split */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Product Image & Codes (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`overflow-hidden rounded-xl border p-4 ${
              darkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-white'
            }`}
          >
            <div
              className={`aspect-[4/3] rounded-lg border flex items-center justify-center p-4 ${
                darkMode ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#E4E4E0] bg-[#FAF9F6]'
              }`}
            >
              <img
                src={imageSrc}
                alt={product.name}
                className="h-full w-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/400';
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div
              className={`rounded-lg border p-3.5 ${
                darkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-white'
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-[#767670]">
                Batch Number
              </div>
              <div className="mt-1 font-mono text-xs sm:text-sm font-semibold truncate">
                {product.batchNumber || 'NOT SET'}
              </div>
            </div>
            <div
              className={`rounded-lg border p-3.5 ${
                darkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-white'
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-[#767670]">
                Barcode
              </div>
              <div className="mt-1 font-mono text-xs sm:text-sm font-semibold truncate">
                {product.barcode || 'NONE'}
              </div>
            </div>
            <div
              className={`rounded-lg border p-3.5 ${
                darkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-white'
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-[#767670]">
                Quantity
              </div>
              <div className="mt-1 tabular-data text-xs sm:text-sm font-semibold">
                {product.quantity || 0} {product.unit || 'units'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Specifications & Dispatch Actions (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`rounded-xl border p-5 ${
              darkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-white'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#767670]">
              <Info size={15} className="text-[#15803D] dark:text-[#4ADE80]" />
              <span>Ledger Specifications</span>
            </div>

            <div className="mt-4 divide-y divide-[#E4E4E0] dark:divide-[#262626]">
              {[
                ['Stock Level', `${product.quantity || 0} ${product.unit || 'units'}`],
                [
                  'Expiration Date',
                  product.expiryDate
                    ? new Date(product.expiryDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Not set'
                ],
                ['Batch / Lot Code', product.batchNumber || 'Not set'],
                ['Storage Location', product.storageLocation || 'Main Shelf'],
                [
                  'Manufacturing Date',
                  product.manufacturingDate
                    ? new Date(product.manufacturingDate).toLocaleDateString()
                    : 'Not recorded'
                ]
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-3 text-xs sm:text-sm">
                  <span className={darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}>{label}</span>
                  <span className="font-mono font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`rounded-xl border p-5 ${
              darkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-white'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#767670]">
              <ShieldCheck size={15} className="text-[#15803D] dark:text-[#4ADE80]" />
              <span>Manual Alert Dispatch &amp; Record Actions</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="accent"
                onClick={handleSendWhatsAppAlert}
                isLoading={whatsappLoading}
                disabled={whatsappSent || whatsappLoading}
                className="h-11 text-xs font-semibold gap-1.5"
              >
                <MessageCircle size={15} />
                <span>{whatsappSent ? 'Sent to WhatsApp' : 'Send WhatsApp Alert'}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleSendTelegramAlert}
                isLoading={telegramLoading}
                disabled={telegramSent || telegramLoading}
                className="h-11 text-xs font-semibold"
              >
                <span>{telegramSent ? 'Sent to Telegram' : 'Send Telegram Alert'}</span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => onEdit?.(product)}
                className="h-11 text-xs font-semibold gap-1.5"
              >
                <Edit size={15} />
                <span>Edit Record</span>
              </Button>

              <Button
                variant="danger"
                onClick={() => onDelete?.(product)}
                className="h-11 text-xs font-semibold gap-1.5"
              >
                <Trash2 size={15} />
                <span>Delete Record</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
