"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function MonthlyLoanTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const monthsPerPage = 12
  const totalMonths = 360 // 30 years * 12 months

  // Loan constants
  const loanAmount = 1000000
  const annualInterestRate = 6.525
  const monthlyInterestRate = annualInterestRate / 12 / 100
  const monthlyPayment = 7100

  const calculateMonthData = (monthNumber: number) => {
    let remainingBalance = loanAmount
    let totalPaid = 0
    let totalInterest = 0

    for (let i = 1; i <= monthNumber; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate
      const principalPayment = monthlyPayment - interestPayment
      remainingBalance = Math.max(0, remainingBalance - principalPayment)
      totalPaid += monthlyPayment
      totalInterest += interestPayment
    }

    const currentInterest = remainingBalance * monthlyInterestRate
    const currentPrincipal = monthlyPayment - currentInterest

    return {
      month: monthNumber,
      year: Math.ceil(monthNumber / 12),
      monthInYear: ((monthNumber - 1) % 12) + 1,
      payment: monthlyPayment,
      principal: currentPrincipal,
      interest: currentInterest,
      remainingBalance,
      totalPaid,
      totalInterest,
    }
  }

  const startMonth = (currentPage - 1) * monthsPerPage + 1
  const endMonth = Math.min(startMonth + monthsPerPage - 1, totalMonths)
  const monthlyData = Array.from({ length: endMonth - startMonth + 1 }, (_, i) => calculateMonthData(startMonth + i))

  const totalPages = Math.ceil(totalMonths / monthsPerPage)

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader className="text-center bg-gradient-to-b from-orange-50 to-white">
          <CardTitle className="text-2xl font-semibold text-orange-500">ตารางผ่อนชำระเงินกู้รายเดือน</CardTitle>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="text-right">จำนวนเงินที่กู้:</div>
            <div className="text-orange-500 font-semibold text-left">฿{loanAmount.toLocaleString()}</div>
            <div className="text-right">ระยะเวลา:</div>
            <div className="text-orange-500 font-semibold text-left">30 ปี (360 งวด)</div>
            <div className="text-right">อัตราดอกเบี้ย:</div>
            <div className="text-orange-500 font-semibold text-left">{annualInterestRate}%</div>
            <div className="text-right">ค่างวดต่อเดือน:</div>
            <div className="text-orange-500 font-semibold text-left">฿{monthlyPayment.toLocaleString()}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-orange-50">
                  <TableHead className="text-center">ปีที่</TableHead>
                  <TableHead className="text-center">เดือนที่</TableHead>
                  <TableHead className="text-right">เงินต้น</TableHead>
                  <TableHead className="text-right">ดอกเบี้ย</TableHead>
                  <TableHead className="text-right">ยอดชำระ</TableHead>
                  <TableHead className="text-right">ยอดชำระสะสม</TableHead>
                  <TableHead className="text-right">ยอดคงเหลือ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.map((data) => (
                  <TableRow key={data.month}>
                    <TableCell className="text-center">{data.year}</TableCell>
                    <TableCell className="text-center">{data.monthInYear}</TableCell>
                    <TableCell className="text-right">฿{Math.round(data.principal).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-orange-600">
                      ฿{Math.round(data.interest).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">฿{Math.round(data.payment).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">
                      ฿{Math.round(data.totalPaid).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">฿{Math.round(data.remainingBalance).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              หน้า {currentPage} จาก {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                ก่อนหน้า
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ถัดไป
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 text-center">
            * ตารางนี้เป็นการคำนวณโดยประมาณ อัตราดอกเบี้ยอาจมีการเปลี่ยนแปลง
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

