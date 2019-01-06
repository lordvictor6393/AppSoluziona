import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { FundingRequest } from '../funding-request/funding-request.model';
import { ExpenseReport } from '../expense-report/expense-report.model';

import * as SZ from '../globalConstants';
import { UsersService } from '../user/user.service';

@Injectable()
export class DashboardService {

    private frErSummary = {};

    constructor(
        private authService: AuthService,
        private userService: UsersService,
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

    GetFrErSummary(startDate: Date, endDate: Date) {
        const frErSummaryDataSource = [];
        this.getFrListFromRange(startDate, endDate)
            .subscribe(this.getFrStats);
        this.getErListFromRange(startDate, endDate)
            .subscribe(this.getErStats);
        for (const userStat in this.frErSummary) {
            if (this.frErSummary.hasOwnProperty(userStat)) {
            frErSummaryDataSource.push(this.frErSummary[userStat]);
            }
        }
        return frErSummaryDataSource;
    }

    increment(target: any, amount = 1): number {
        if (target) {
            return target + amount;
        } else {
            return amount;
        }
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
            stats.frCount = this.increment(stats.frCount);
            stats.totalRequested = this.increment(stats.totalRequested, fr.total);
            if (!fr.erId) {
                stats.frWithoutErCount = this.increment(stats.frWithoutErCount);
                if (fr.state === SZ.APPROVED) {
                    stats.totalWithoutReport = this.increment(stats.totalWithoutReport, fr.total);
                }
            }
            switch (fr.state) {
                case SZ.REJECTED: stats.frRejectedCount = this.increment(stats.frRejectedCount); break;
                case SZ.APPROVED: stats.frApprovedCount = this.increment(stats.frApprovedCount); break;
            }
        });
    }

    getErStats = (erList: ExpenseReport[]) => {
        erList.forEach(er => {
            if (!this.frErSummary.hasOwnProperty(er.createUserId)) {
                this.frErSummary[er.createUserId] = {};
            }
            const stats = this.frErSummary[er.createUserId];
            stats.erCount = this.increment(stats.erCount);
            stats.totalReported = this.increment(stats.totalReported, er.totalSpent);
            switch (er.state) {
                case SZ.REJECTED: stats.erRejectedCount = this.increment(stats.erRejectedCount); break;
                case SZ.APPROVED: stats.erApprovedCount = this.increment(stats.erApprovedCount); break;
            }
        });
    }
}
