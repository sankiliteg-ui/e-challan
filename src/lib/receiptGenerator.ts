import type { Challan } from "@/data/mockData";

export const generateReceiptHTML = (challan: Challan): string => {
  const receiptDate = new Date().toLocaleDateString("en-IN");
  const receiptTime = new Date().toLocaleTimeString("en-IN");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Challan Receipt - ${challan.challanNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 5px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .receipt-number {
            text-align: center;
            background: #f0f9ff;
            padding: 10px;
            border-radius: 6px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
            text-transform: uppercase;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .info-item {
            margin-bottom: 15px;
        }
        .info-label {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 16px;
            color: #333;
            font-weight: 500;
        }
        .violation-section {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .violation-type {
            font-size: 18px;
            font-weight: bold;
            color: #d39e00;
            margin-bottom: 5px;
        }
        .violation-location {
            font-size: 14px;
            color: #856404;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
        .status-disputed { background: #e0e7ff; color: #3730a3; }
        .amount-section {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
        }
        .amount-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        .amount-value {
            font-size: 48px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 30px;
            color: #999;
            font-size: 12px;
        }
        .officer-info {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            margin-top: 15px;
        }
        .due-date-warning {
            background: #fecaca;
            color: #7f1d1d;
            padding: 12px;
            border-radius: 6px;
            margin: 15px 0;
            font-size: 14px;
            font-weight: 500;
        }
        @media print {
            body { background: white; padding: 0; }
            .receipt-container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <h1>🛣️ e-Challan</h1>
            <p>Ministry of Road Transport & Highways</p>
        </div>

        <div class="receipt-number">
            Receipt ID: ${challan.challanNumber}
        </div>

        <div class="section">
            <div class="section-title">Violation Details</div>
            <div class="violation-section">
                <div class="violation-type">${challan.violationType}</div>
                <div class="violation-location">${challan.location}</div>
                <div style="margin-top: 10px;">
                    <span class="status-badge status-${challan.status}">${challan.status}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Vehicle & Owner Information</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Vehicle Number</div>
                    <div class="info-value">${challan.vehicleNumber}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Owner Name</div>
                    <div class="info-value">${challan.ownerName}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Incident Information</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Date of Violation</div>
                    <div class="info-value">${challan.date}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Time</div>
                    <div class="info-value">${challan.time}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Due Date</div>
                    <div class="info-value">${challan.dueDate}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Officer Badge</div>
                    <div class="info-value">${challan.officerBadge}</div>
                </div>
            </div>
            <div class="officer-info">
                <div class="info-label">Traffic Officer</div>
                <div class="info-value">${challan.officerName}</div>
            </div>
        </div>

        ${
          challan.status !== "paid"
            ? `<div class="due-date-warning">⚠️ Payment Due Date: ${challan.dueDate}</div>`
            : ""
        }

        <div class="amount-section">
            <div class="amount-label">Fine Amount</div>
            <div class="amount-value">₹${challan.fineAmount.toLocaleString("en-IN")}</div>
        </div>

        <div class="section">
            <div class="section-title">Payment Status</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Status</div>
                    <div class="info-value">
                        <span class="status-badge status-${challan.status}">${challan.status.toUpperCase()}</span>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">Challan Number</div>
                    <div class="info-value" style="font-family: monospace;">${challan.challanNumber}</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Receipt Generated: ${receiptDate} at ${receiptTime}</p>
            <p style="margin-top: 10px;">This is an official receipt of a traffic violation.</p>
            <p>For more information, visit: www.echallan.gov.in</p>
        </div>
    </div>
</body>
</html>
  `;
};

export const downloadReceipt = (challan: Challan) => {
  const html = generateReceiptHTML(challan);
  const blob = new Blob([html], { type: "text/html" });
  const filename = `receipt-${challan.challanNumber}.html`;
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
