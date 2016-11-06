import {ITDepartment} from '../../../../../../src/department/it/ITDepartment';
import {WirelessMicBooker} from '../../../../../../src/department/it/stuff/wirelessMic/WirelessMicBooker';
import {WirelessMicBookingJiraIssueRequestSender} from '../../../../../../src/department/it/stuff/wirelessMic/WirelessMicBookingJiraIssueRequestSender';
import {User} from '../../../../../../src/user/User';
import * as TypeMoq from 'typemoq';

describe('WirelessMicBooker', () => {
    let wirelessMicBooker:WirelessMicBooker;
    let itDepartment:TypeMoq.Mock<ITDepartment>;
    let jiraIssueRequestSender:TypeMoq.Mock<WirelessMicBookingJiraIssueRequestSender>;

    beforeEach(() => {
        itDepartment = TypeMoq.Mock.ofType(ITDepartment);
        jiraIssueRequestSender = TypeMoq.Mock.ofType(WirelessMicBookingJiraIssueRequestSender);
        wirelessMicBooker = new WirelessMicBooker(itDepartment.object, jiraIssueRequestSender.object);
    });

    describe('booking a wireless microphone headset to borrow', () => {
        describe('when the IT department is friendly for the borrowing user', () => {
            it('simply makes the booking', () => {
                // given
                const user:User = {firstName: 'Michal', lastName: 'Stocki'};
                itDepartment.setup(it => it.isFriendlyFor(TypeMoq.It.isValue(user))).returns(() => true);

                // when
                wirelessMicBooker.bookMicrophoneFor(user, new Date('11-07-2016'));

                // then
                itDepartment.verify(it => it.simplyBookWirelessMicFor(TypeMoq.It.isValue(user)), TypeMoq.Times.once());
            });
        });

        describe('when the IT department is not friendly for the borrowing user', () => {
            it('delegates creating the booking request Jira issue', () => {
                // given
                const user:User = {firstName: 'Michal', lastName: 'Stocki'};
                itDepartment.setup(it => it.isFriendlyFor(TypeMoq.It.isValue(user))).returns(() => false);
                const date = new Date('11-07-2016');

                // when
                wirelessMicBooker.bookMicrophoneFor(user, date);

                // then
                jiraIssueRequestSender.verify(j => {
                    j.sendBookRequestFor(TypeMoq.It.isValue(user), TypeMoq.It.isValue(date))
                }, TypeMoq.Times.once());
            });
        });
    });
});
