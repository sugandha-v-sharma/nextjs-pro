"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface EmiDetails {
    emi: number;
    totalAmount: number;
    totalInterest: number;
    principalAmount: number;
    yearlyPayments: Array<{
        year: number;
        principal: number;
        interest: number;
    }>;
}

const COLORS = {
    principal: '#0ea5e9', // sky-500
    interest: '#ef4444', // red-500
    remaining: '#22c55e', // green-500
};

export default function EmiCalculator() {
    const [loanAmount, setLoanAmount] = useState<number>(1000000);
    const [interestRate, setInterestRate] = useState<number>(8.5);
    const [loanTenure, setLoanTenure] = useState<number>(20);
    const [emiDetails, setEmiDetails] = useState<EmiDetails>({
        emi: 0,
        totalAmount: 0,
        totalInterest: 0,
        principalAmount: 0,
        yearlyPayments: []
    });

    const [formInputs, setFormInputs] = useState({
        loanAmount: loanAmount.toString(),
        interestRate: interestRate.toString(),
        loanTenure: loanTenure.toString()
    });

    const calculateAmortizationSchedule = (
        principal: number,
        annualRate: number,
        years: number
    ) => {
        const monthlyRate = annualRate / 12 / 100;
        const totalMonths = years * 12;
        const emi = principal * monthlyRate * 
            (Math.pow(1 + monthlyRate, totalMonths)) / 
            (Math.pow(1 + monthlyRate, totalMonths) - 1);

        let remainingBalance = principal;
        const yearlyPayments = [];
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;
        
        for (let month = 1; month <= totalMonths; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = emi - interestPayment;
            remainingBalance -= principalPayment;

            yearlyPrincipal += principalPayment;
            yearlyInterest += interestPayment;

            if (month % 12 === 0 || month === totalMonths) {
                yearlyPayments.push({
                    year: Math.ceil(month / 12),
                    principal: Math.round(yearlyPrincipal),
                    interest: Math.round(yearlyInterest)
                });
                yearlyPrincipal = 0;
                yearlyInterest = 0;
            }
        }

        return {
            emi: Math.round(emi),
            totalAmount: Math.round(emi * totalMonths),
            totalInterest: Math.round((emi * totalMonths) - principal),
            principalAmount: principal,
            yearlyPayments
        };
    };

    const handleInputChange = (field: string, value: string) => {
        setFormInputs(prev => ({ ...prev, [field]: value }));
    };

    const applyInputValues = () => {
        const newLoanAmount = parseFloat(formInputs.loanAmount);
        const newInterestRate = parseFloat(formInputs.interestRate);
        const newLoanTenure = parseFloat(formInputs.loanTenure);

        if (!isNaN(newLoanAmount) && newLoanAmount > 0) {
            setLoanAmount(Math.min(Math.max(newLoanAmount, 100000), 10000000));
        }
        if (!isNaN(newInterestRate) && newInterestRate > 0) {
            setInterestRate(Math.min(Math.max(newInterestRate, 5), 20));
        }
        if (!isNaN(newLoanTenure) && newLoanTenure > 0) {
            setLoanTenure(Math.min(Math.max(newLoanTenure, 1), 30));
        }
    };

    useEffect(() => {
        const details = calculateAmortizationSchedule(loanAmount, interestRate, loanTenure);
        setEmiDetails(details);
    }, [loanAmount, interestRate, loanTenure]);

    useEffect(() => {
        setFormInputs({
            loanAmount: loanAmount.toString(),
            interestRate: interestRate.toString(),
            loanTenure: loanTenure.toString()
        });
    }, [loanAmount, interestRate, loanTenure]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const distributionData = [
        { name: 'Principal', value: emiDetails.principalAmount },
        { name: 'Interest', value: emiDetails.totalInterest }
    ];

    const firstYearData = emiDetails.yearlyPayments[0] ? [
        { name: 'Principal Paid', value: emiDetails.yearlyPayments[0].principal },
        { name: 'Interest Paid', value: emiDetails.yearlyPayments[0].interest },
        { 
            name: 'Remaining Principal', 
            value: emiDetails.principalAmount - emiDetails.yearlyPayments[0].principal 
        }
    ] : [];

return (
    <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Loan Calculator</CardTitle>
                    <CardDescription>
                        Enter your loan details or use the sliders to calculate EMI
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Loan Amount Input Group */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                            <span className="text-sm text-muted-foreground">
                                {formatCurrency(loanAmount)}
                            </span>
                        </div>
                        <div className="grid grid-cols-[1fr,120px] gap-4 items-center">
                            <Slider
                                id="loan-amount"
                                min={100000}
                                max={10000000}
                                step={10000}
                                value={[loanAmount]}
                                onValueChange={(value) => setLoanAmount(value[0])}
                                className="mt-2"
                            />
                            <Input
                                type="number"
                                value={formInputs.loanAmount}
                                onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                                placeholder="Amount"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="interest-rate">Interest Rate (% p.a)</Label>
                            <span className="text-sm text-muted-foreground">
                                {interestRate}%
                            </span>
                        </div>
                        <div className="grid grid-cols-[1fr,120px] gap-4 items-center">
                            <Slider
                                id="interest-rate"
                                min={5}
                                max={20}
                                step={0.1}
                                value={[interestRate]}
                                onValueChange={(value) => setInterestRate(value[0])}
                                className="mt-2"
                            />
                            <Input
                                type="number"
                                value={formInputs.interestRate}
                                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                                placeholder="Rate"
                                step="0.1"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="loan-tenure">Loan Tenure (Years)</Label>
                            <span className="text-sm text-muted-foreground">
                                {loanTenure} years
                            </span>
                        </div>
                        <div className="grid grid-cols-[1fr,120px] gap-4 items-center">
                            <Slider
                                id="loan-tenure"
                                min={1}
                                max={30}
                                value={[loanTenure]}
                                onValueChange={(value) => setLoanTenure(value[0])}
                                className="mt-2"
                            />
                            <Input
                                type="number"
                                value={formInputs.loanTenure}
                                onChange={(e) => handleInputChange('loanTenure', e.target.value)}
                                placeholder="Years"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <Button 
                        onClick={applyInputValues}
                        className="w-full"
                    >
                        Calculate EMI
                    </Button>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-4 bg-primary/10 rounded-lg">
                            <p className="text-sm text-muted-foreground">Monthly EMI</p>
                            <p className="text-xl font-bold text-primary">
                                {formatCurrency(emiDetails.emi)}
                            </p>
                        </div>
                        <div className="p-4 bg-destructive/10 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Interest</p>
                            <p className="text-xl font-bold text-destructive">
                                {formatCurrency(emiDetails.totalInterest)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Total Loan Distribution</CardTitle>
                        <CardDescription>
                            Principal vs Interest over entire tenure
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={0} 
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill={COLORS.principal} />
                                        <Cell fill={COLORS.interest} />
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">First Year Breakdown</CardTitle>
                        <CardDescription>
                            Payment distribution in the first year
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={firstYearData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={0} 
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill={COLORS.principal} />
                                        <Cell fill={COLORS.interest} />
                                        <Cell fill={COLORS.remaining} />
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Year-wise Payment Schedule</CardTitle>
                <CardDescription>
                    Detailed breakdown of payments for each year
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Year</TableHead>
                                <TableHead>Principal Paid</TableHead>
                                <TableHead>Interest Paid</TableHead>
                                <TableHead>Total Payment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {emiDetails.yearlyPayments.map((payment) => (
                                <TableRow key={payment.year}>
                                    <TableCell>{payment.year}</TableCell>
                                    <TableCell>{formatCurrency(payment.principal)}</TableCell>
                                    <TableCell>{formatCurrency(payment.interest)}</TableCell>
                                    <TableCell>
                                        {formatCurrency(payment.principal + payment.interest)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
);

}