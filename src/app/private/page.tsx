"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LoanCalculator() {
  // Constants from the provided values
  const loanAmount = 1000000
  const interestRate = 6.525
  const monthlyPayment = 7100
  const loanTermYears = 30

  // Calculate sample years for memorization (showing key years)
  const calculateYearData = (year: number) => {
    const monthsPassed = year * 12
    const totalPaid = monthlyPayment * monthsPassed
    const yearlyInterest = loanAmount * (interestRate / 100)
    const principalPaid = totalPaid - yearlyInterest * year
    const remainingBalance = Math.max(0, loanAmount - principalPaid)

    return {
      year,
      totalPaid,
      remainingBalance,
      interestPaid: totalPaid - (loanAmount - remainingBalance),
    }
  }

  // Generate data for key years (1, 5, 10, 15, 20, 25, 30)
  const keyYears = [1, 5, 10, 15, 20, 25, 30].map(calculateYearData)

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center bg-gradient-to-b from-orange-50 to-white">
          <CardTitle className="text-2xl font-semibold text-orange-500">ตารางผ่อนชำระเงินกู้</CardTitle>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="text-right">จำนวนเงินที่กู้:</div>
            <div className="text-orange-500 font-semibold text-left">฿{loanAmount.toLocaleString()}</div>
            <div className="text-right">ระยะเวลา:</div>
            <div className="text-orange-500 font-semibold text-left">{loanTermYears} ปี</div>
            <div className="text-right">อัตราดอกเบี้ย:</div>
            <div className="text-orange-500 font-semibold text-left">{interestRate}%</div>
            <div className="text-right">ค่างวดต่อเดือน:</div>
            <div className="text-orange-500 font-semibold text-left">฿{monthlyPayment.toLocaleString()}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead className="text-center">ปีที่</TableHead>
                <TableHead className="text-right">ยอดผ่อนชำระสะสม</TableHead>
                <TableHead className="text-right">ดอกเบี้ยจ่ายสะสม</TableHead>
                <TableHead className="text-right">ยอดคงเหลือ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keyYears.map((data) => (
                <TableRow key={data.year}>
                  <TableCell className="text-center font-medium">{data.year}</TableCell>
                  <TableCell className="text-right">฿{Math.round(data.totalPaid).toLocaleString()}</TableCell>
                  <TableCell className="text-right text-orange-600">
                    ฿{Math.round(data.interestPaid).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">฿{Math.round(data.remainingBalance).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-sm text-gray-500 text-center">
            * ตารางนี้เป็นการคำนวณโดยประมาณ อัตราดอกเบี้ยอาจมีการเปลี่ยนแปลง
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

