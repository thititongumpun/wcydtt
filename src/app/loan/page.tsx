"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AcceleratedLoanPayoff() {
  // Loan constants
  const loanAmount = 500000
  const annualInterestRate = 2
  const monthlyInterestRate = annualInterestRate / 12 / 100
  const monthlyPayment = 10000

  const calculatePayoffSchedule = () => {
    let balance = loanAmount
    let month = 0
    const schedule = []
    let totalInterestPaid = 0

    while (balance > 0) {
      month++
      const interestPayment = balance * monthlyInterestRate
      const principalPayment = Math.min(monthlyPayment - interestPayment, balance)
      balance -= principalPayment
      totalInterestPaid += interestPayment

      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        totalPayment: principalPayment + interestPayment,
        remainingBalance: balance,
      })

      if (balance < 0.01) break // To avoid floating point issues
    }

    return { schedule, totalMonths: month, totalInterestPaid }
  }

  const { schedule, totalMonths, totalInterestPaid } = calculatePayoffSchedule()

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center bg-gradient-to-b from-orange-50 to-white">
          <CardTitle className="text-2xl font-semibold text-orange-500">ตารางชำระเงินกู้แบบเร่งรัด</CardTitle>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="text-right">จำนวนเงินที่กู้:</div>
            <div className="text-orange-500 font-semibold text-left">฿{loanAmount.toLocaleString()}</div>
            <div className="text-right">อัตราดอกเบี้ยต่อปี:</div>
            <div className="text-orange-500 font-semibold text-left">{annualInterestRate}%</div>
            <div className="text-right">ค่างวดต่อเดือน:</div>
            <div className="text-orange-500 font-semibold text-left">฿{monthlyPayment.toLocaleString()}</div>
            <div className="text-right">ระยะเวลาชำระหนี้:</div>
            <div className="text-orange-500 font-semibold text-left">{totalMonths} เดือน</div>
            <div className="text-right">ดอกเบี้ยจ่ายทั้งหมด:</div>
            <div className="text-orange-500 font-semibold text-left">
              ฿{Math.round(totalInterestPaid).toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-orange-50">
                  <TableHead className="text-center">งวดที่</TableHead>
                  <TableHead className="text-right">เงินต้น</TableHead>
                  <TableHead className="text-right">ดอกเบี้ย</TableHead>
                  <TableHead className="text-right">ยอดชำระ</TableHead>
                  <TableHead className="text-right">ยอดคงเหลือ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((data) => (
                  <TableRow key={data.month}>
                    <TableCell className="text-center">{data.month}</TableCell>
                    <TableCell className="text-right">฿{Math.round(data.principal).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-orange-600">
                      ฿{Math.round(data.interest).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">฿{Math.round(data.totalPayment).toLocaleString()}</TableCell>
                    <TableCell className="text-right">฿{Math.round(data.remainingBalance).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            * ตารางนี้เป็นการคำนวณโดยประมาณ อัตราดอกเบี้ยอาจมีการเปลี่ยนแปลง
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

