<?php

namespace app\controllers\course;

use app\controllers\AbstractController;
use app\controllers\admin\ConfigurationController;
use app\libraries\response\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use app\models\Email;

class CourseRegistrationController extends AbstractController {
    /**
     * @param array<string> $instructors
     */
    private function notifyInstructors(string $user, string $term, string $course, array $instructors): void {
        $subject = "User $user has joined course $course";
        $body = "$user has joined the course $course for term $term.";
        $emails = [];
        foreach ($instructors as $instructor) {
            $emails[] = new Email(
                $this->core,
                [
                    "subject" => $subject,
                    "body" => $body,
                    "to_user_id" => $instructor
                ]
            );
        }

        $this->core->getNotificationFactory()->sendEmails($emails);
    }

    #[Route("/courses/{term}/{course}/self_register")]
    public function selfRegister(string $term, string $course): RedirectResponse {
        $this->core->loadCourseConfig($term, $course);
        $this->core->loadCourseDatabase();
        if ($this->core->getQueries()->getSelfRegistrationType($course) ===  ConfigurationController::NO_SELF_REGISTER) {
            $this->core->addErrorMessage('Self registration is not allowed.');
            return new RedirectResponse($this->core->buildUrl(['home']));
        }
        $default_section = $this->core->getQueries()->getDefaultRegistrationSection($term, $course);
        $this->core->getUser()->setRegistrationSection($default_section);
        $this->core->getQueries()->insertCourseUser($this->core->getUser(), $term, $course);
        $instructor_ids = $this->core->getQueries()->getActiveUserIds(true, false, false, false, false);
        $this->notifyInstructors($this->core->getUser()->getId(), $term, $course, $instructor_ids);
        return new RedirectResponse($this->core->buildCourseUrl());
    }
}