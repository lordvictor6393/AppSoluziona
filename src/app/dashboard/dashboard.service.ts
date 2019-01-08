import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { FundingRequest } from '../funding-request/funding-request.model';
import { ExpenseReport } from '../expense-report/expense-report.model';

import * as SZ from '../globalConstants';
import Num from '../utils/number-utils';
import { UsersService } from '../user/user.service';
import { ExpenseReportService } from '../expense-report/expense-report.service';

@Injectable()
export class DashboardService {

    private frErSummary = {};

    constructor(
        private authService: AuthService,
        private userService: UsersService,
        private erService: ExpenseReportService,
        private db: AngularFirestore) { }

    getFrListFromRange(startDate: Date, endDate: Date): Observable<FundingRequest[]> {
        const user = this.authService.loggedUserInstance;
        if (user) {
            return this.db.collection(
                'fundingRequests',
                ref => ref.where('date', '<', endDate.getTime()).where('date', '>', startDate.getTime())
                ).snapshotChanges().pipe(
                    map(frList => frList.map(FundingRequest.getFrFromSnapshot))
                );
        }
    }

    getErListFromRange(startDate: Date, endDate: Date): Observable<ExpenseReport[]> {
        const user = this.authService.loggedUserInstance;
        if (user) {
            return this.db.collection(
                'expenseReports',
                ref => ref.where('date', '<', endDate.getTime()).where('date', '>', startDate.getTime())
                ).snapshotChanges().pipe(
                    map(frList => frList.map(ExpenseReport.getErFromSnapshot))
                );
        }
    }

    GetFrErSummary(startDate: Date, endDate: Date): Observable<any[]> {
        this.frErSummary = {};
        return combineLatest(
            this.getFrListFromRange(startDate, endDate),
            this.getErListFromRange(startDate, endDate)).pipe(
                map(res => {
                    const frErSummaryDataSource = [];
                    this.getFrStats(res[0] || []);
                    this.getErStats(res[1] || []);
                    for (const userStat in this.frErSummary) {
                        if (this.frErSummary.hasOwnProperty(userStat)) {
                        frErSummaryDataSource.push(this.frErSummary[userStat]);
                        }
                    }
                    return frErSummaryDataSource;
                }));
    }

    getFrStats = (frList: FundingRequest[]) => {
        frList.forEach(fr => {
            if (!this.frErSummary.hasOwnProperty(fr.createUserId)) {
                this.frErSummary[fr.createUserId] = {};
            }
            const stats = this.frErSummary[fr.createUserId];
            if (!stats.userName) {
                stats.userName = this.userService.getCompleteUserName(fr.createUserId);
            }
            stats.frCount = Num.add(stats.frCount);
            if (fr.state === SZ.APPROVED) {
                stats.totalRequested = Num.add(stats.totalRequested, fr.total);
                if (!fr.erId || this.erService.getErData(fr.erId, 'status') !== SZ.APPROVED) {
                    stats.frWithoutErCount = Num.add(stats.frWithoutErCount);
                    stats.totalWithoutReport = Num.add(stats.totalWithoutReport, fr.total);
                }
            }
            switch (fr.state) {
                case SZ.REJECTED: stats.frRejectedCount = Num.add(stats.frRejectedCount); break;
                case SZ.APPROVED: stats.frApprovedCount = Num.add(stats.frApprovedCount); break;
            }
        });
    }

    getErStats = (erList: ExpenseReport[]) => {
        erList.forEach(er => {
            if (!this.frErSummary.hasOwnProperty(er.createUserId)) {
                this.frErSummary[er.createUserId] = {};
            }
            const stats = this.frErSummary[er.createUserId];
            stats.erCount = Num.add(stats.erCount);
            stats.totalReported = Num.add(stats.totalReported, er.totalSpent);
            switch (er.state) {
                case SZ.REJECTED: stats.erRejectedCount = Num.add(stats.erRejectedCount); break;
                case SZ.APPROVED: stats.erApprovedCount = Num.add(stats.erApprovedCount); break;
            }
        });
    }
}
