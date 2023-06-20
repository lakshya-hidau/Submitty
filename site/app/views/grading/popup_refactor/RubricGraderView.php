<?php

/**
 * ---------------------
 *
 * RubricGradearView.php
 *
 * This class creates the main display window for the Rubric Grader, featuring the
 * NavigationBar and the PanelBar.
 *
 * The function createRubricGradeableView is called from createMainRubricGraderPage
 * of RubricGraderController.php.
 *
 * ---------------------
 */

# Namespace:
namespace app\views\grading\popup_refactor;


# Includes:
// Our super class
use app\views\AbstractView;

// Used for prev and next navigation, as well as outputing the sorting type as
// a string
use app\models\GradingOrder;


# Main Class:
class RubricGraderView extends AbstractView {


    /**
     * Creates the Rubric Grading page visually.
     * This function is called in reateMainRubricGraderPage of RubricGraderController.php.
     * 
     * @param string $gradeable - The current Gradeable.
     * @param string $sort_type - The current way we are sorting students. Used to create the header.
     * @param string $sort_direction -  Either "ASC" or "DESC" for ascending or descending sorting order.
     *     Used to create the header.
     * 
     */
    public function createRubricGradeableView($gradeable, $sort_type, $sort_direction) {
        $this->setMemberVariables($gradeable);

        $this->createBreadcrumbHeader($sort_type, $sort_direction);

        $this->addCSSs();
    }


    /**
     * Sets the corresponding memeber variables based on provided arguments.
     * 
     * @param string $gradeable - The current Gradeable.
     */
    private function setMemberVariables($gradeable) {
        $this->gradeable = $gradeable;

    }

    /**
     * Created breadcrumb navigation header based on current sorting and gradeable id.
     * Navigation should be:
     *     Submitty > COURSE_NAME > GRADEABLE_NAME Grading > Grading Interface $sort_id $sort_direction Order
     * 
     * @param string $sort_type - The current way we are sorting students.
     * @param string $sort_direction -  Either "ASC" or "DESC" for ascending or descending sorting order.
     */
    private function createBreadcrumbHeader($sort_type, $sort_direction) {
        $gradeableUrl = $this->core->buildCourseUrl(['gradeable', $this->gradeable->getId(),
            'grading', 'details']);
        $this->core->getOutput()->addBreadcrumb("{$this->gradeable->getTitle()} Grading", $gradeableUrl);

        $this->core->getOutput()->addBreadcrumb('Grading Interface ' .
            GradingOrder::getGradingOrderMessage($sort_type, $sort_direction));
    }


    /**
     * Adds CSS files used for the Rubric Grader page.
     */
    private function addCSSs() {
        $this->core->getOutput()->addInternalCss('popup_refactor/navigation-bar.css');
    }

}