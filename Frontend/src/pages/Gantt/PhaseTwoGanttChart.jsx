import React, { useState } from "react";
import HeaderButtons from "../Dashboard/DashboardHeader/HeaderButtons";

// Updated CSS styles embedded in component
const styles = `
.ruda-container {
    width: 100%;
    height: 100vh;
    font-family: Arial, sans-serif;
    font-size: 12px;
    display: flex;
    flex-direction: column;
  }

  .ruda-content {
    flex: 1;
    overflow: auto;
  }
  
  .ruda-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
          background: radial-gradient(farthest-side ellipse at 20% 0, #333867 40%, #23274b);
    color: white;
    padding: 18px 20px;
    margin-bottom: 0;
  }
  
  .ruda-title {
    margin: 0;
    font-weight: 100;
    font-size: 1.5rem;
    color: #fff;
    text-transform: uppercase;
  }
  
  .ruda-logo {
    color: #c0c0c0;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .ruda-table {
    border-collapse: collapse;
    width: 100%;
    min-width: 1600px;
    border-radius: 0px;
    overflow: hidden;
  }
  
  .ruda-header {
          background:  #23274b;
    color: white;
    font-weight: bold;
    font-size: 13px;
    padding: 12px 8px;
    border: 1px solid #2c4a6b;
    text-align: center;
    vertical-align: middle;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }

  .ruda-header.phases-packages {
    width: 365px;
    min-width: 365px;
    text-align: left;
    padding-left: 16px;
  }

  .ruda-header.amount-column {
    width: 80px;
    min-width: 80px;
  }

  .ruda-header.duration-column {
    width: 80px;
    min-width: 80px;
  }

  .ruda-header.schedule-column {
    width: 80px;
    min-width: 80px;
  }

  .ruda-header.performance-column {
    width: 80px;
    min-width: 80px;
  }

  .ruda-header.planned-value-column {
    width: 80px;
    min-width: 80px;
  }

  .ruda-header.earned-value-column {
    width: 80px;
    min-width: 80px;
  }

  .ruda-header.actual-start-column {
    width: 80px;
    min-width: 80px;
  }

  .ruda-header.actual-finish-column {
    width: 80px;
    min-width: 80px;
  }
  
  .ruda-month-header {
    background-color: #23274b;
    color: white;
    font-size: 9px;
    padding: 4px 1px;
    border: 1px solid #2c4a6b;
    text-align: center;
  }
  
  .ruda-phase-header {
    background: linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 100%);
    color: white;
    font-weight: bold;
    font-size: 14px;
    padding: 10px 12px;
    border: 1px solid #5a5a5a;
    text-align: left;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }

  .ruda-phase-row {
    cursor: pointer;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    transition: all 0.3s ease;
  }

  .ruda-phase-row:hover {
    background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  .ruda-package-row {
    cursor: pointer;
    background: linear-gradient(135deg, #e8f4fd 0%, #f1f8ff 100%);
    border-left: 4px solid #3498db;
    transition: all 0.3s ease;
  }

  .ruda-package-row:hover {
    background: linear-gradient(135deg, #d4edda 0%, #e8f4fd 100%);
    border-left: 4px solid #2980b9;
    transform: translateX(2px);
  }

  .ruda-subpackage-row {
    cursor: pointer;
    background: linear-gradient(135deg, #fff8e1 0%, #fffbf0 100%);
    border-left: 4px solid #f39c12;
    transition: all 0.3s ease;
  }

  .ruda-subpackage-row:hover {
    background: linear-gradient(135deg, #ffeaa7 0%, #fff8e1 100%);
    border-left: 4px solid #e67e22;
    transform: translateX(2px);
  }
  
  .ruda-activity-row {
    cursor: pointer;
    background: linear-gradient(135deg, #e8f6f3 0%, #f0f9ff 100%);
    border-left: 3px solid #17a2b8;
    transition: all 0.3s ease;
  }

  .ruda-activity-row:hover {
    background: linear-gradient(135deg, #bee5eb 0%, #e8f6f3 100%);
    border-left: 3px solid #138496;
    transform: translateX(1px);
  }

  .package-cell {
    padding-left: 20px;
    font-weight: bold;
    color: #2c5282;
    font-size: 13px;
  }

  .subpackage-cell {
    padding-left: 36px;
    font-weight: bold;
    color: #d36c2c;
    font-size: 12px;
  }

  .ruda-subsubpackage-row {
    cursor: pointer;
    background: linear-gradient(135deg, #f0f8ff 0%, #f8fbff 100%);
    border-left: 3px solid #6c757d;
    transition: all 0.3s ease;
  }

  .ruda-subsubpackage-row:hover {
    background: linear-gradient(135deg, #b3e5fc 0%, #f0f8ff 100%);
    border-left: 3px solid #495057;
    transform: translateX(1px);
  }

  .ruda-reach-row {
    cursor: pointer;
    background: linear-gradient(135deg, #fdf2f8 0%, #fef7ff 100%);
    border-left: 3px solid #e83e8c;
    transition: all 0.3s ease;
  }

  .ruda-reach-row:hover {
    background: linear-gradient(135deg, #e1bee7 0%, #fdf2f8 100%);
    border-left: 3px solid #d91a72;
    transform: translateX(1px);
  }

  .ruda-material-row {
    cursor: pointer;
    background: linear-gradient(135deg, #f0fff4 0%, #f7fffa 100%);
    border-left: 3px solid #28a745;
    transition: all 0.3s ease;
  }

  .ruda-material-row:hover {
    background: linear-gradient(135deg, #c8e6c9 0%, #f0fff4 100%);
    border-left: 3px solid #1e7e34;
    transform: translateX(1px);
  }
  
  .activity-cell {
    padding-left: 52px;
    color: #1c17aa;
    font-size: 11px;
    font-weight: 500;
  }
  
  .ruda-subsubpackage-row {
    cursor: pointer;
    background-color: #e1f5fe;
  }
  
  .ruda-subsubpackage-row:hover {
    background-color: #b3e5fc;
  }
  
  .ruda-reach-row {
    cursor: pointer;
    background-color: #f3e5f5;
  }
  
  .ruda-reach-row:hover {
    background-color: #e1bee7;
  }
  
  .ruda-material-row {
    cursor: pointer;
    background-color: #e8f5e8;
  }
  
  .ruda-material-row:hover {
    background-color: #c8e6c9;
  }
  
  .subsubpackage-cell {
    padding-left: 52px;
    font-weight: bold;
    color: #0253bd;
    font-size: 12px;
  }

  .reach-cell {
    padding-left: 68px;
    font-weight: bold;
    color: #7b1fa2;
    font-size: 11px;
  }

  .material-cell {
    padding-left: 84px;
    color: #2e7d32;
    font-size: 10px;
    font-weight: 500;
  }
  
  .ruda-separator-row {
    background-color: #e2e8f0;
  }
  
  .ruda-separator-cell {
    padding: 8px 16px;
    font-weight: bold;
    color: #4a5568;
    border: 1px solid #cbd5e0;
  }
  
  .ruda-cell {
    padding: 6px 10px;
    font-size: 11px;
    border: 1px solid #e0e0e0;
    background-color: white;
    text-align: left;
    transition: all 0.2s ease;
  }

  .ruda-cell:hover {
    background-color: #f8f9fa;
    border-color: #ced4da;
  }
  
  .ruda-bold {
    font-weight: bold;
  }
  
  .ruda-timeline-cell {
    position: relative;
    height: 24px;
    border: 1px solid #e0e0e0;
    background-color: #fafafa;
    transition: all 0.2s ease;
  }

  .ruda-timeline-cell:hover {
    background-color: #f0f0f0;
    border-color: #ced4da;
  }

  .ruda-bar {
    position: absolute;
    height: 16px;
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    border-radius: 3px;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
  }

  .ruda-bar:hover {
    background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
  
  .ruda-total-cell {
    background-color: #23274b;
    color: white;
    font-weight: bold;
    font-size: 13px;
    padding: 8px 6px;
    border: 1px solid #2c4a6b;
    text-align: center;
  }
  
  .ruda-selected-info {
    background: linear-gradient(135deg, #f0f8ff 0%, #e8f4fd 100%);
    border: 2px solid #4caf50;
    padding: 20px;
    margin: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  .ruda-selected-info:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }

  .ruda-selected-info h3 {
    margin: 0 0 12px 0;
    color: #23274b;
    font-size: 18px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  .ruda-selected-info p {
    margin: 8px 0;
    color: #555;
    font-size: 14px;
    line-height: 1.5;
  }

  .ruda-selected-info strong {
    color: #2c3e50;
    font-weight: 600;
  }
  
  .right {
    text-align: right;
  }
  
  .indent {
    padding-left: 12px;
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .ruda-container {
      font-size: 10px;
    }

    .ruda-header.phases-packages {
      width: 300px;
      min-width: 300px;
    }

    .ruda-header.amount-column,
    .ruda-header.duration-column,
    .ruda-header.schedule-column,
    .ruda-header.performance-column {
      width: 80px;
      min-width: 80px;
    }
  }

  @media (max-width: 768px) {
    .ruda-container {
      font-size: 9px;
    }

    .ruda-table {
      min-width: 1200px;
    }
  }

  /* Print Styles */
  @media print {
    .ruda-container {
      font-size: 8px;
    }

    .ruda-table {
      min-width: auto;
    }

    .ruda-selected-info {
      display: none;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const PhaseTwoGanttChart = () => {
  const [expandedPhases, setExpandedPhases] = useState(new Set([0]));
  const [expandedPackages, setExpandedPackages] = useState(new Set());
  const [expandedSubpackages, setExpandedSubpackages] = useState(new Set());
  const [expandedSubsubpackages, setExpandedSubsubpackages] = useState(
    new Set()
  );
  const [expandedReaches, setExpandedReaches] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);

  const data = [
    // Phase 2 - Enhanced with Package structure from PDF
    {
      phase: "PHASE 02",
      amount: "140,531",
      packages: [
        {
          name: "RUDA:Package-2 UP-River Training Works & Barrage Left Embankment (RD 0+000 to RD 10+500)",
          budgetedCost: "1,963,944,060.01",
          plannedValue: "1,962,814,361.55",
          earnedValue: "912,053,647.82",
          actualStart: "22-Jul-24",
          actualFinish: "22-Jul-25",
          scheduleComplete: "99.94%",
          performanceComplete: "46.44%",
          timeline: [
            0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
          subpackages: [
            {
              name: "RUDA:Package-2.1 Contract Startup",
              duration: "16",
              budgetedCost: "0.00",
              plannedValue: "0.00",
              earnedValue: "0.00",
              actualStart: "22-Jul-24",
              actualFinish: "08-Aug-24",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              subsubpackages: [
                {
                  name: "RUDA:Package-2.1.1 General Requirements",
                  duration: "16",
                  budgetedCost: "0.00",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "08-Aug-24",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Provision of Performance Security",
                      duration: "3",
                      plannedValue: "-",
                      earnedValue: "-",
                      actualStart: "22-Jul-24",
                      actualFinish: "24-Jul-24",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Effective access to and possession of site",
                      duration: "4",
                      plannedValue: "-",
                      earnedValue: "-",
                      actualStart: "23-Jul-24",
                      actualFinish: "26-Jul-24",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Start of Initial Survey",
                      duration: "14",
                      plannedValue: "-",
                      earnedValue: "-",
                      actualStart: "24-Jul-24",
                      actualFinish: "08-Aug-24",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.1.2 Contract Requirements",
                  duration: "0",
                  budgetedCost: "0.00",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-24",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Date of Commencement",
                      duration: "0",
                      plannedValue: "-",
                      earnedValue: "-",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-24",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.2 Mobilization",
              duration: "10",
              budgetedCost: "0.00",
              plannedValue: "0.00",
              earnedValue: "0.00",
              actualStart: "26-Jul-24",
              actualFinish: "06-Aug-24",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              activities: [
                {
                  name: "Establishment of Site boundaries, Compound, Offices, etc",
                  duration: "7",
                  plannedValue: "-",
                  earnedValue: "-",
                  actualStart: "26-Jul-24",
                  actualFinish: "02-Aug-24",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Mobilization of Contractor's Equipment",
                  duration: "8",
                  plannedValue: "-",
                  earnedValue: "-",
                  actualStart: "29-Jul-24",
                  actualFinish: "06-Aug-24",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.3 Submission & Approval of Documents",
              duration: "22",
              budgetedCost: "0.00",
              plannedValue: "0.00",
              earnedValue: "0.00",
              actualStart: "22-Jul-24",
              actualFinish: "22-Jul-25",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              subsubpackages: [
                {
                  name: "RUDA:Package-2.3.1 Design Engineering(Drawings)",
                  duration: "0",
                  budgetedCost: "0.00",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Issuance of Construction Drawings(Cross section) IFC's",
                      duration: "0",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Prepare and submission Shop Drawings",
                      duration: "0",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.3.2 Submission of Method Statement",
                  duration: "7",
                  budgetedCost: "0.00",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Prepare & Submission method statements and approval",
                      duration: "7",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.3.3 HSE Protocols",
                  duration: "15",
                  budgetedCost: "0.00",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Submission of HSE Plans",
                      duration: "5",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Submission of all Possible Critical Activities M/S",
                      duration: "7",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Induction training to upcoming workforce",
                      duration: "8",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.4 Material Procurement",
              duration: "289",
              budgetedCost: "0.00",
              plannedValue: "0.00",
              earnedValue: "0.00",
              actualStart: "22-Jul-24",
              actualFinish: "22-Jul-25",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              subsubpackages: [
                {
                  name: "RUDA:Package-2.4.1 Material Delivery",
                  duration: "273",
                  budgetedCost: "0.00",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  reaches: [
                    {
                      name: "RUDA:Package-2.4.1.1 Coffer Dam",
                      duration: "16",
                      budgetedCost: "0.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(Coarse Filter)",
                          duration: "14",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "50%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "14",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.2 Reach-1",
                      duration: "132",
                      budgetedCost: "0.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "60",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "60",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "60",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "73",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.3 Reach-2",
                      duration: "68",
                      budgetedCost: "0.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "35",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "15",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "15",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "20",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.4 Reach-3",
                      duration: "87",
                      budgetedCost: "0.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
                        1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "45",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "35",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "60.4%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "35",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "60.4%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "30",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "60.4%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.5 Reach-4",
                      duration: "73",
                      budgetedCost: "0.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                        1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "35",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "28",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "28",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "24",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.6 Reach-5",
                      duration: "60",
                      budgetedCost: "0.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "15",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "30",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "30",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "40",
                          plannedValue: "0.00",
                          earnedValue: "0.00",
                          actualStart: "22-Jul-24",
                          actualFinish: "22-Jul-25",
                          scheduleComplete: "100%",
                          performanceComplete: "60%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                            1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              activities: [
                {
                  name: "Submit Source of material(Stone)",
                  duration: "0",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Approval of Material Source",
                  duration: "3",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.5 Construction Works",
              duration: "300",
              budgetedCost: "1,963,944,060.01",
              plannedValue: "1,962,814,361.55",
              earnedValue: "912,053,647.82",
              actualStart: "22-Jul-24",
              actualFinish: "22-Jul-25",
              scheduleComplete: "99.94%",
              performanceComplete: "46.44%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              subsubpackages: [
                {
                  name: "RUDA:Package-2.5.1 Reach-1(0+900 to 3+000)",
                  duration: "145",
                  budgetedCost: "357,952,088.13",
                  plannedValue: "357,952,088.13",
                  earnedValue: "357,952,088.13",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-1(0+900 to 3+000)",
                      duration: "141",
                      budgetedCost: "130,681,828.13",
                      plannedValue: "130,681,828.13",
                      earnedValue: "130,681,828.13",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-1(0+900 to 3+000)",
                      duration: "94",
                      budgetedCost: "227,270,260.00",
                      plannedValue: "227,270,260.00",
                      earnedValue: "227,270,260.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.2 Coffer Dam",
                  duration: "75",
                  budgetedCost: "219,795,585.00",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "99.65%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Cofferdam(EarthWork)",
                      duration: "73",
                      budgetedCost: "64,446,045.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Cofferdam(StoneWork)",
                      duration: "67",
                      budgetedCost: "155,349,540.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "99.51%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.4 Cut off Channel",
                  duration: "43",
                  budgetedCost: "18,480,000.00",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Cut Channel - Earthwork Excavation",
                      duration: "43",
                      budgetedCost: "18,480,000.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.5 Reach-2(3+000 to 5+250)",
                  duration: "87",
                  budgetedCost: "341,929,096.72",
                  plannedValue: "281,114,831.67",
                  earnedValue: "272,986,728.02",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "79.84%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-2(3+000 to 5+250)",
                      duration: "69",
                      budgetedCost: "114,658,836.72",
                      plannedValue: "101,261,444.55",
                      earnedValue: "103,102,355.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "89.92%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-2(3+000 to 5+250)",
                      duration: "50",
                      budgetedCost: "227,270,260.00",
                      plannedValue: "179,853,387.12",
                      earnedValue: "169,884,373.02",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "74.75%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.6 Reach-3(5+250 to 7+000)",
                  duration: "89",
                  budgetedCost: "341,929,096.72",
                  plannedValue: "272,986,728.02",
                  earnedValue: "272,986,728.02",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "79.84%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-3(5+250 to 7+000)",
                      duration: "77",
                      budgetedCost: "114,658,836.72",
                      plannedValue: "101,261,444.55",
                      earnedValue: "103,102,355.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "89.92%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-3(5+250 to 7+000)",
                      duration: "53",
                      budgetedCost: "227,270,260.00",
                      plannedValue: "169,884,373.02",
                      earnedValue: "169,884,373.02",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "74.75%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
                        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.7 Reach-4(7+000 to 10+500)",
                  duration: "88",
                  budgetedCost: "341,929,096.72",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
                    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-4(7+000 to 10+500)",
                      duration: "66",
                      budgetedCost: "114,658,836.72",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                        1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-4(7+000 to 10+500)",
                      duration: "51",
                      budgetedCost: "227,270,260.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.8 Reach-5(0+000 to 0+900)",
                  duration: "73",
                  budgetedCost: "341,929,096.72",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "99.89%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-5(0+000 to 0+900)",
                      duration: "41",
                      budgetedCost: "114,658,836.72",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-5(0+000 to 0+900)",
                      duration: "61",
                      budgetedCost: "227,270,260.00",
                      plannedValue: "0.00",
                      earnedValue: "0.00",
                      actualStart: "22-Jul-24",
                      actualFinish: "22-Jul-25",
                      scheduleComplete: "99.84%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.6 Project Finish",
              duration: "0",
              budgetedCost: "0.00",
              plannedValue: "0.00",
              earnedValue: "0.00",
              actualStart: "22-Jul-24",
              actualFinish: "22-Jul-25",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              activities: [
                {
                  name: "Project End",
                  duration: "0",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.7 Finish Milestone",
              duration: "146",
              budgetedCost: "0.00",
              plannedValue: "0.00",
              earnedValue: "0.00",
              actualStart: "22-Jul-24",
              actualFinish: "22-Jul-25",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              activities: [
                {
                  name: "Reach-1(0+900 to 3+000)",
                  duration: "0",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Reach-02(3+000 to 5+250)",
                  duration: "0",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },

                {
                  name: "Cut off Channel",
                  duration: "0",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Reach-3(5+250 to 7+500)",
                  duration: "0",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Reach-5(0+000 to 0+900)",
                  duration: "0",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Reach-4(7+500 to 10+500)",
                  duration: "0",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Coffer Dam",
                  duration: "0",
                  plannedValue: "0.00",
                  earnedValue: "0.00",
                  actualStart: "22-Jul-24",
                  actualFinish: "22-Jul-25",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
              ],
            },
          ],
        },
      ],
      // Keep original items for backward compatibility
      items: [
        {
          name: "Preliminary Bunds Ph 02 and Ph 03 (30 km x 2)",
          amount: "10,000",
          timeline: [
            0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "River Channelization (16.5 Km)",
          amount: "53,020",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Check Dams (02 Nos)",
          amount: "1,702",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Road Network (78 Km)",
          amount: "25,495",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Bridges (01 No) & Interchanges (03 Nos)",
          amount: "22,280",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Trunk Sewer Network (15 Km Both Sides)",
          amount: "19,034",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Power Transmission & Grid Stations (01 No)",
          amount: "9,000",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ],
        },
      ],
    },
  ];

  const months = [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ];

  const togglePhase = (phaseIndex) => {
    const newSet = new Set(expandedPhases);
    newSet.has(phaseIndex) ? newSet.delete(phaseIndex) : newSet.add(phaseIndex);
    setExpandedPhases(newSet);
  };

  const togglePackage = (packageKey) => {
    const newSet = new Set(expandedPackages);
    newSet.has(packageKey) ? newSet.delete(packageKey) : newSet.add(packageKey);
    setExpandedPackages(newSet);
  };

  const toggleSubpackage = (subpackageKey) => {
    const newSet = new Set(expandedSubpackages);
    newSet.has(subpackageKey)
      ? newSet.delete(subpackageKey)
      : newSet.add(subpackageKey);
    setExpandedSubpackages(newSet);
  };

  const toggleSubsubpackage = (subsubpackageKey) => {
    const newSet = new Set(expandedSubsubpackages);
    newSet.has(subsubpackageKey)
      ? newSet.delete(subsubpackageKey)
      : newSet.add(subsubpackageKey);
    setExpandedSubsubpackages(newSet);
  };

  const toggleReach = (reachKey) => {
    const newSet = new Set(expandedReaches);
    newSet.has(reachKey) ? newSet.delete(reachKey) : newSet.add(reachKey);
    setExpandedReaches(newSet);
  };

  const handleItemClick = (item, type = "item") => {
    // Only set timeline for leaf items that have timeline data
    if (item.timeline && Array.isArray(item.timeline)) {
      setSelectedItem(item);
    }
  };

  const renderTimeline = (item) => {
    if (!item.timeline || !Array.isArray(item.timeline)) return null;

    const start = item.timeline.findIndex((v) => v === 1);
    const duration = item.timeline.filter((v) => v === 1).length;

    if (start === -1 || duration === 0) return null;

    return (
      <div
        className="ruda-bar"
        style={{
          left: `${start * 18}px`,
          width: `${duration * 18}px`,
        }}
      />
    );
  };

  const formatAmount = (amount) => {
    if (!amount || amount === "0.00") return "-";
    // Convert to millions if it's a large number
    const num = parseFloat(amount.replace(/,/g, ""));
    if (num > 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    return amount;
  };

  return (
    <div className="ruda-container">
      <div className="ruda-header-container">
        <h1 className="ruda-title">RUDA DEVELOPMENT PLAN - TIMELINE</h1>
        <HeaderButtons />
      </div>
      <div className="ruda-content">
        <div style={{ position: "relative" }}>
          {/* Move vertical lines outside the table */}
          {/* {[263, 514, 763, 1014, 1264].map((left, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 60,
              left: `${195 + left}px`,
              width: "0.08px",
              height: "88%",
              backgroundColor: "#000000",
              zIndex: 10,
            }}
          />
        ))} */}
          <table className="ruda-table">
            <thead>
              <tr>
                <th className="ruda-header phases-packages" rowSpan="2">
                  PHASES / PACKAGES
                </th>
                <th className="ruda-header amount-column" rowSpan="2">
                  Amount
                  <br />
                  <small>(PKR, M)</small>
                </th>
                <th className="ruda-header duration-column" rowSpan="2">
                  Duration
                  <br />
                  <small>(Days)</small>
                </th>
                <th className="ruda-header schedule-column" rowSpan="2">
                  Schedule
                  <br />
                  <small>%</small>
                </th>
                <th className="ruda-header performance-column" rowSpan="2">
                  Performance
                  <br />
                  <small>%</small>
                </th>
                <th className="ruda-header planned-value-column" rowSpan="2">
                  Planned Value
                  <br />
                  <small>(PKR, M)</small>
                </th>
                <th className="ruda-header earned-value-column" rowSpan="2">
                  Earned Value
                  <br />
                  <small>(PKR, M)</small>
                </th>
                <th className="ruda-header actual-start-column" rowSpan="2">
                  Actual Start
                </th>
                <th className="ruda-header actual-finish-column" rowSpan="2">
                  Actual Finish
                </th>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="ruda-header" colSpan="12">
                    FY {25 + i}-{26 + i}
                  </th>
                ))}
              </tr>
              <tr>
                {months.map((month, index) => (
                  <th key={index} className="ruda-month-header">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((phase, phaseIndex) => (
                <React.Fragment key={phaseIndex}>
                  <tr
                    className="ruda-phase-row"
                    onClick={() => togglePhase(phaseIndex)}
                  >
                    <td className="ruda-phase-header">
                      {phase.phase} {expandedPhases.has(phaseIndex) ? "▲" : "▼"}
                    </td>
                    <td className="ruda-phase-header right">{phase.amount}</td>
                    <td className="ruda-phase-header right">-</td>
                    <td className="ruda-phase-header right">-</td>
                    <td className="ruda-phase-header right">-</td>
                    <td className="ruda-phase-header right">-</td>
                    <td className="ruda-phase-header right">-</td>
                    <td className="ruda-phase-header right">-</td>
                    <td className="ruda-phase-header right">-</td>
                    <td colSpan={60} className="ruda-phase-header"></td>
                  </tr>

                  {expandedPhases.has(phaseIndex) && (
                    <>
                      {/* Render packages if they exist (Phase 2 enhanced structure) */}
                      {phase.packages &&
                        phase.packages.map((pkg, pkgIndex) => {
                          const packageKey = `${phaseIndex}-${pkgIndex}`;
                          return (
                            <React.Fragment key={packageKey}>
                              <tr
                                className="ruda-package-row"
                                onClick={() => togglePackage(packageKey)}
                              >
                                <td className="ruda-cell package-cell">
                                  {pkg.name}{" "}
                                  {expandedPackages.has(packageKey) ? "▲" : "▼"}
                                </td>
                                <td className="ruda-cell ruda-bold right">
                                  {formatAmount(pkg.budgetedCost)}
                                </td>
                                <td className="ruda-cell right">-</td>
                                <td className="ruda-cell right">
                                  {pkg.scheduleComplete || "-"}
                                </td>
                                <td className="ruda-cell right">
                                  {pkg.performanceComplete || "-"}
                                </td>
                                <td className="ruda-cell right">
                                  {formatAmount(pkg.plannedValue) || "-"}
                                </td>
                                <td className="ruda-cell right">
                                  {formatAmount(pkg.earnedValue) || "-"}
                                </td>
                                <td className="ruda-cell right">
                                  {pkg.actualStart || "-"}
                                </td>
                                <td className="ruda-cell right">
                                  {pkg.actualFinish || "-"}
                                </td>
                                <td colSpan={60} className="ruda-timeline-cell">
                                  {renderTimeline(pkg)}
                                </td>
                              </tr>

                              {expandedPackages.has(packageKey) &&
                                pkg.subpackages &&
                                pkg.subpackages.map((subpkg, subIndex) => {
                                  const subpackageKey = `${packageKey}-${subIndex}`;
                                  return (
                                    <React.Fragment key={subpackageKey}>
                                      <tr
                                        className="ruda-subpackage-row"
                                        onClick={() =>
                                          toggleSubpackage(subpackageKey)
                                        }
                                      >
                                        <td className="ruda-cell subpackage-cell">
                                          &nbsp;&nbsp;{subpkg.name}{" "}
                                          {expandedSubpackages.has(
                                            subpackageKey
                                          )
                                            ? "▲"
                                            : "▼"}
                                        </td>
                                        <td className="ruda-cell right">
                                          {formatAmount(subpkg.budgetedCost)}
                                        </td>
                                        <td className="ruda-cell right">
                                          {subpkg.duration || "-"}
                                        </td>
                                        <td className="ruda-cell right">
                                          {subpkg.scheduleComplete || "-"}
                                        </td>
                                        <td className="ruda-cell right">
                                          {subpkg.performanceComplete || "-"}
                                        </td>
                                        <td className="ruda-cell right">
                                          {formatAmount(subpkg.plannedValue) ||
                                            "-"}
                                        </td>
                                        <td className="ruda-cell right">
                                          {formatAmount(subpkg.earnedValue) ||
                                            "-"}
                                        </td>
                                        <td className="ruda-cell right">
                                          {subpkg.actualStart || "-"}
                                        </td>
                                        <td className="ruda-cell right">
                                          {subpkg.actualFinish || "-"}
                                        </td>
                                        <td
                                          colSpan={60}
                                          className="ruda-timeline-cell"
                                        >
                                          {renderTimeline(subpkg)}
                                        </td>
                                      </tr>

                                      {/* Render subsubpackages if they exist */}
                                      {expandedSubpackages.has(subpackageKey) &&
                                        subpkg.subsubpackages &&
                                        subpkg.subsubpackages.map(
                                          (subsubpkg, subsubIndex) => {
                                            const subsubpackageKey = `${subpackageKey}-${subsubIndex}`;
                                            return (
                                              <React.Fragment
                                                key={subsubpackageKey}
                                              >
                                                <tr
                                                  className="ruda-subsubpackage-row"
                                                  onClick={() =>
                                                    toggleSubsubpackage(
                                                      subsubpackageKey
                                                    )
                                                  }
                                                >
                                                  <td className="ruda-cell subsubpackage-cell">
                                                    &nbsp;&nbsp;&nbsp;&nbsp;🔷{" "}
                                                    {subsubpkg.name}{" "}
                                                    {expandedSubsubpackages.has(
                                                      subsubpackageKey
                                                    )
                                                      ? "▲"
                                                      : "▼"}
                                                  </td>
                                                  <td className="ruda-cell right">
                                                    {formatAmount(
                                                      subsubpkg.budgetedCost
                                                    )}
                                                  </td>
                                                  <td className="ruda-cell right">
                                                    {subsubpkg.duration || "-"}
                                                  </td>
                                                  <td className="ruda-cell right">
                                                    {subsubpkg.scheduleComplete ||
                                                      "-"}
                                                  </td>
                                                  <td className="ruda-cell right">
                                                    {subsubpkg.performanceComplete ||
                                                      "-"}
                                                  </td>
                                                  <td className="ruda-cell right">
                                                    {formatAmount(
                                                      subsubpkg.plannedValue
                                                    ) || "-"}
                                                  </td>
                                                  <td className="ruda-cell right">
                                                    {formatAmount(
                                                      subsubpkg.earnedValue
                                                    ) || "-"}
                                                  </td>
                                                  <td className="ruda-cell right">
                                                    {subsubpkg.actualStart ||
                                                      "-"}
                                                  </td>
                                                  <td className="ruda-cell right">
                                                    {subsubpkg.actualFinish ||
                                                      "-"}
                                                  </td>
                                                  <td
                                                    colSpan={60}
                                                    className="ruda-timeline-cell"
                                                  >
                                                    {renderTimeline(subsubpkg)}
                                                  </td>
                                                </tr>

                                                {/* Render reaches if they exist (for Material Delivery) */}
                                                {expandedSubsubpackages.has(
                                                  subsubpackageKey
                                                ) &&
                                                  subsubpkg.reaches &&
                                                  subsubpkg.reaches.map(
                                                    (reach, reachIndex) => {
                                                      const reachKey = `${subsubpackageKey}-${reachIndex}`;
                                                      return (
                                                        <React.Fragment
                                                          key={reachKey}
                                                        >
                                                          <tr
                                                            className="ruda-reach-row"
                                                            onClick={() =>
                                                              toggleReach(
                                                                reachKey
                                                              )
                                                            }
                                                          >
                                                            <td className="ruda-cell reach-cell">
                                                              &nbsp;&nbsp;
                                                              &nbsp;&nbsp;
                                                              &nbsp;&nbsp;🟢{" "}
                                                              {reach.name}{" "}
                                                              {expandedReaches.has(
                                                                reachKey
                                                              )
                                                                ? "▲"
                                                                : "▼"}
                                                            </td>
                                                            <td className="ruda-cell right">
                                                              {formatAmount(
                                                                reach.budgetedCost
                                                              )}
                                                            </td>
                                                            <td className="ruda-cell right">
                                                              {reach.duration ||
                                                                "-"}
                                                            </td>
                                                            <td className="ruda-cell right">
                                                              {reach.scheduleComplete ||
                                                                "-"}
                                                            </td>
                                                            <td className="ruda-cell right">
                                                              {reach.performanceComplete ||
                                                                "-"}
                                                            </td>
                                                            <td className="ruda-cell right">
                                                              {formatAmount(
                                                                reach.plannedValue
                                                              ) || "-"}
                                                            </td>
                                                            <td className="ruda-cell right">
                                                              {formatAmount(
                                                                reach.earnedValue
                                                              ) || "-"}
                                                            </td>
                                                            <td className="ruda-cell right">
                                                              {reach.actualStart ||
                                                                "-"}
                                                            </td>
                                                            <td className="ruda-cell right">
                                                              {reach.actualFinish ||
                                                                "-"}
                                                            </td>
                                                            <td
                                                              colSpan={60}
                                                              className="ruda-timeline-cell"
                                                            >
                                                              {renderTimeline(
                                                                reach
                                                              )}
                                                            </td>
                                                          </tr>

                                                          {/* Render materials */}
                                                          {expandedReaches.has(
                                                            reachKey
                                                          ) &&
                                                            reach.materials &&
                                                            reach.materials.map(
                                                              (
                                                                material,
                                                                materialIndex
                                                              ) => (
                                                                <tr
                                                                  key={
                                                                    materialIndex
                                                                  }
                                                                  className="ruda-material-row"
                                                                  onClick={() =>
                                                                    handleItemClick(
                                                                      material,
                                                                      "material"
                                                                    )
                                                                  }
                                                                >
                                                                  <td className="ruda-cell material-cell">
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🧱{" "}
                                                                    {
                                                                      material.name
                                                                    }
                                                                  </td>
                                                                  <td className="ruda-cell right">
                                                                    -
                                                                  </td>
                                                                  <td className="ruda-cell right">
                                                                    {material.duration ||
                                                                      "-"}
                                                                  </td>
                                                                  <td className="ruda-cell right">
                                                                    {material.scheduleComplete ||
                                                                      "-"}
                                                                  </td>
                                                                  <td className="ruda-cell right">
                                                                    {material.performanceComplete ||
                                                                      "-"}
                                                                  </td>
                                                                  <td className="ruda-cell right">
                                                                    {formatAmount(
                                                                      material.plannedValue
                                                                    ) || "-"}
                                                                  </td>
                                                                  <td className="ruda-cell right">
                                                                    {formatAmount(
                                                                      material.earnedValue
                                                                    ) || "-"}
                                                                  </td>
                                                                  <td className="ruda-cell right">
                                                                    {material.actualStart ||
                                                                      "-"}
                                                                  </td>
                                                                  <td className="ruda-cell right">
                                                                    {material.actualFinish ||
                                                                      "-"}
                                                                  </td>
                                                                  <td
                                                                    colSpan={60}
                                                                    className="ruda-timeline-cell"
                                                                  >
                                                                    {renderTimeline(
                                                                      material
                                                                    )}
                                                                  </td>
                                                                </tr>
                                                              )
                                                            )}
                                                        </React.Fragment>
                                                      );
                                                    }
                                                  )}

                                                {/* Render activities for subsubpackages */}
                                                {expandedSubsubpackages.has(
                                                  subsubpackageKey
                                                ) &&
                                                  subsubpkg.activities &&
                                                  subsubpkg.activities.map(
                                                    (activity, actIndex) => (
                                                      <tr
                                                        key={actIndex}
                                                        className="ruda-activity-row"
                                                        onClick={() =>
                                                          handleItemClick(
                                                            activity,
                                                            "activity"
                                                          )
                                                        }
                                                      >
                                                        <td className="ruda-cell activity-cell">
                                                          &nbsp;&nbsp;&nbsp;&nbsp;
                                                          &nbsp;&nbsp;🟢{" "}
                                                          {activity.name}
                                                        </td>
                                                        <td className="ruda-cell right">
                                                          {formatAmount(
                                                            activity.budgetedCost
                                                          )}
                                                        </td>
                                                        <td className="ruda-cell right">
                                                          {activity.duration ||
                                                            "-"}
                                                        </td>
                                                        <td className="ruda-cell right">
                                                          {activity.scheduleComplete ||
                                                            "-"}
                                                        </td>
                                                        <td className="ruda-cell right">
                                                          {activity.performanceComplete ||
                                                            "-"}
                                                        </td>
                                                        <td className="ruda-cell right">
                                                          {formatAmount(
                                                            activity.plannedValue
                                                          ) || "-"}
                                                        </td>
                                                        <td className="ruda-cell right">
                                                          {formatAmount(
                                                            activity.earnedValue
                                                          ) || "-"}
                                                        </td>
                                                        <td className="ruda-cell right">
                                                          {activity.actualStart ||
                                                            "-"}
                                                        </td>
                                                        <td className="ruda-cell right">
                                                          {activity.actualFinish ||
                                                            "-"}
                                                        </td>
                                                        <td
                                                          colSpan={60}
                                                          className="ruda-timeline-cell"
                                                        >
                                                          {renderTimeline(
                                                            activity
                                                          )}
                                                        </td>
                                                      </tr>
                                                    )
                                                  )}
                                              </React.Fragment>
                                            );
                                          }
                                        )}

                                      {/* Render direct activities for subpackages (without subsubpackages) */}
                                      {expandedSubpackages.has(subpackageKey) &&
                                        subpkg.activities &&
                                        !subpkg.subsubpackages &&
                                        subpkg.activities.map(
                                          (activity, actIndex) => (
                                            <tr
                                              key={actIndex}
                                              className="ruda-activity-row"
                                              onClick={() =>
                                                handleItemClick(
                                                  activity,
                                                  "activity"
                                                )
                                              }
                                            >
                                              <td className="ruda-cell activity-cell">
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;🟢 {activity.name}
                                              </td>
                                              <td className="ruda-cell right">
                                                {formatAmount(
                                                  activity.budgetedCost
                                                )}
                                              </td>
                                              <td className="ruda-cell right">
                                                {activity.duration || "-"}
                                              </td>
                                              <td className="ruda-cell right">
                                                {activity.scheduleComplete ||
                                                  "-"}
                                              </td>
                                              <td className="ruda-cell right">
                                                {activity.performanceComplete ||
                                                  "-"}
                                              </td>
                                              <td className="ruda-cell right">
                                                {formatAmount(
                                                  activity.plannedValue
                                                ) || "-"}
                                              </td>
                                              <td className="ruda-cell right">
                                                {formatAmount(
                                                  activity.earnedValue
                                                ) || "-"}
                                              </td>
                                              <td className="ruda-cell right">
                                                {activity.actualStart || "-"}
                                              </td>
                                              <td className="ruda-cell right">
                                                {activity.actualFinish || "-"}
                                              </td>
                                              <td
                                                colSpan={60}
                                                className="ruda-timeline-cell"
                                              >
                                                {renderTimeline(activity)}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                    </React.Fragment>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}

                      {/* Render original items structure for phases without packages */}
                      {phase.items &&
                        !phase.packages &&
                        phase.items.map((item, itemIndex) => (
                          <tr
                            key={itemIndex}
                            onClick={() => handleItemClick(item)}
                          >
                            <td className="ruda-cell indent">{item.name}</td>
                            <td className="ruda-cell ruda-bold right">
                              {item.amount}
                            </td>
                            <td className="ruda-cell right">-</td>
                            <td className="ruda-cell right">-</td>
                            <td className="ruda-cell right">-</td>
                            <td className="ruda-cell right">-</td>
                            <td className="ruda-cell right">-</td>
                            <td className="ruda-cell right">-</td>
                            <td className="ruda-cell right">-</td>
                            <td colSpan={60} className="ruda-timeline-cell">
                              {renderTimeline(item)}
                            </td>
                          </tr>
                        ))}

                      {/* Render original items for phases that have both packages and items (Phase 2) */}
                    </>
                  )}
                </React.Fragment>
              ))}
              <tr>
                <td className="ruda-total-cell">Total</td>
                <td className="ruda-total-cell right">399,175</td>
                <td className="ruda-total-cell right">-</td>
                <td className="ruda-total-cell right">-</td>
                <td className="ruda-total-cell right">-</td>
                <td className="ruda-total-cell right">-</td>
                <td className="ruda-total-cell right">-</td>
                <td className="ruda-total-cell right">-</td>
                <td className="ruda-total-cell right">-</td>
                <td colSpan={60} className="ruda-total-cell"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {selectedItem && (
          <div className="ruda-selected-info">
            <h3>Selected Item: {selectedItem.name}</h3>
            <p>Timeline visualization updated above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseTwoGanttChart;
