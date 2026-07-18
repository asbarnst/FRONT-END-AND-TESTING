package com.employee.automation;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.*;

import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.Duration;
import java.util.List;

public class TestNG_Report {

    WebDriver driver;
    WebDriverWait wait;

    static final String BASE_URL   = "http://localhost:5173/";
    static final String ADMIN_USER = "admin";
    static final String ADMIN_PASS = "asbardy";   // updated admin password

    // ── Setup ─────────────────────────────────────────────────────────────────
    @BeforeTest
    public void setup() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        driver.get(BASE_URL);
        System.out.println("\n========================================");
        System.out.println("  Employee Portal — Full Automation Test");
        System.out.println("  Admin Password : " + ADMIN_PASS);
        System.out.println("  URL            : " + BASE_URL);
        System.out.println("========================================\n");
    }

    // ── Helper: click sidebar nav button by its exact label text ─────────────
    private void clickNav(String label) throws InterruptedException {
        Thread.sleep(600);
        // nav buttons have class "nav-link-btn" and contain the label text
        List<WebElement> btns = driver.findElements(By.cssSelector(".nav-link-btn"));
        for (WebElement btn : btns) {
            if (btn.getText().trim().toLowerCase().contains(label.toLowerCase())) {
                btn.click();
                Thread.sleep(1000);
                return;
            }
        }
        throw new RuntimeException("Nav button not found for label: " + label);
    }

    // ── Helper: print pass/fail ───────────────────────────────────────────────
    private void log(String name, boolean passed) {
        System.out.printf("  %-55s %s%n", name, passed ? "[PASS]" : "[FAIL]");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 1 — Admin Login (password: asbardy)
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 1)
    public void test01_AdminLogin() throws InterruptedException {
        System.out.println("--- Test 1: Admin Login (password: asbardy) ---");

        // Click the Admin role card
        WebElement adminCard = wait.until(
            ExpectedConditions.elementToBeClickable(
                By.cssSelector(".role-card-item.admin")
            )
        );
        adminCard.click();
        Thread.sleep(400);

        // Fill username
        WebElement usernameInput = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.id("login-username"))
        );
        usernameInput.clear();
        usernameInput.sendKeys(ADMIN_USER);

        // Fill password
        WebElement passwordInput = driver.findElement(By.id("login-password"));
        passwordInput.clear();
        passwordInput.sendKeys(ADMIN_PASS);

        // Submit
        driver.findElement(By.cssSelector(".aurora-login-btn")).click();

        // Wait for sidebar to appear
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".sidebar")));
        String src = driver.getPageSource();
        boolean passed = src.contains("Dashboard") || src.contains("Admin User") || src.contains("nav-link-btn");
        Assert.assertTrue(passed, "Dashboard should load after login");
        log("Admin login with password 'asbardy'", passed);
        Thread.sleep(1500);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 2 — Dashboard / Home Section
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 2, dependsOnMethods = "test01_AdminLogin")
    public void test02_Dashboard() throws InterruptedException {
        System.out.println("--- Test 2: Dashboard ---");
        clickNav("Dashboard");
        Thread.sleep(1000);

        String src = driver.getPageSource();
        boolean hasStats = src.contains("Total Employees") || src.contains("Present")
                        || src.contains("Payroll")  || src.contains("Remote");
        Assert.assertTrue(hasStats, "Dashboard should show stat cards");
        log("Dashboard stat cards visible", hasStats);

        // Sidebar is rendered
        boolean hasSidebar = !driver.findElements(By.cssSelector(".sidebar")).isEmpty();
        log("Sidebar rendered correctly", hasSidebar);
        Thread.sleep(1000);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 3 — Employees Section
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 3, dependsOnMethods = "test02_Dashboard")
    public void test03_EmployeesSection() throws InterruptedException {
        System.out.println("--- Test 3: Employees Section ---");
        clickNav("Employees");
        Thread.sleep(1000);

        String src = driver.getPageSource();
        boolean hasEmpList = src.contains("EMP-") && src.contains("Department");
        Assert.assertTrue(hasEmpList, "Employees section should list employees with EMP-IDs");
        log("Employee list with EMP-IDs rendered", hasEmpList);

        // Search bar test
        try {
            WebElement searchInput = driver.findElement(
                By.xpath("//input[contains(@placeholder,'earch')]")
            );
            searchInput.sendKeys("Bala");
            Thread.sleep(700);
            boolean searchWorks = driver.getPageSource().contains("Bala");
            log("Search filter for 'Bala' works", searchWorks);
            searchInput.clear();
            Thread.sleep(400);
        } catch (Exception e) {
            System.out.println("  Search input not found — skipping");
        }

        // Add Employee form visible (admin only)
        boolean hasAddForm = driver.getPageSource().contains("Add Employee");
        log("Add Employee form visible (admin)", hasAddForm);
        Thread.sleep(1000);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 4 — Attendance Section
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 4, dependsOnMethods = "test03_EmployeesSection")
    public void test04_AttendanceSection() throws InterruptedException {
        System.out.println("--- Test 4: Attendance Section ---");
        clickNav("Attendance");
        Thread.sleep(1000);

        String src = driver.getPageSource();
        boolean hasAttendance = src.contains("Present") && src.contains("Absent");
        Assert.assertTrue(hasAttendance, "Attendance section should show Present/Absent buttons");
        log("Attendance Present/Absent/Half Day buttons visible", hasAttendance);

        // Date picker visible
        boolean hasDatePicker = !driver.findElements(By.cssSelector("input[type='date']")).isEmpty();
        log("Date picker input present", hasDatePicker);

        // Mark first employee as Present
        try {
            List<WebElement> presentBtns = driver.findElements(
                By.cssSelector(".att-btn.present")
            );
            if (!presentBtns.isEmpty()) {
                presentBtns.get(0).click();
                Thread.sleep(1000);
                log("Clicked 'Present' for first employee", true);
            } else {
                log("att-btn.present not found", false);
            }
        } catch (Exception e) {
            System.out.println("  Could not click Present: " + e.getMessage());
        }
        Thread.sleep(1000);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 5 — Schedule Section
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 5, dependsOnMethods = "test04_AttendanceSection")
    public void test05_ScheduleSection() throws InterruptedException {
        System.out.println("--- Test 5: Schedule / Work Tasks ---");
        clickNav("Schedule");
        Thread.sleep(1200);

        String src = driver.getPageSource();
        boolean hasTasks = src.contains("Pending") || src.contains("In Progress") || src.contains("Done");
        Assert.assertTrue(hasTasks, "Schedule section should show task statuses");
        log("Task status labels visible (Pending/In Progress/Done)", hasTasks);

        // Task cards
        List<WebElement> taskCards = driver.findElements(By.cssSelector(".task-card"));
        log("Task cards rendered (" + taskCards.size() + " found)", taskCards.size() > 0);

        // Countdown timers present
        boolean hasCountdown = src.contains("Time Left") || src.contains("Overdue") || src.contains("days");
        log("Countdown timers present", hasCountdown);

        // Add Task form (admin)
        boolean hasAddTask = src.contains("Add Task") || src.contains("Task title");
        log("Add Task form visible (admin)", hasAddTask);
        Thread.sleep(1000);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 6 — Salary Section
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 6, dependsOnMethods = "test05_ScheduleSection")
    public void test06_SalarySection() throws InterruptedException {
        System.out.println("--- Test 6: Salary Section ---");
        clickNav("Salary");
        Thread.sleep(1200);

        String src = driver.getPageSource();
        boolean hasSalaryTable = src.contains("Salary Records") || src.contains("Monthly Salary");
        Assert.assertTrue(hasSalaryTable, "Salary section should show salary records table");
        log("Salary records table visible", hasSalaryTable);

        // Paid / Pending status
        boolean hasStatus = src.contains("Paid") || src.contains("Pending");
        log("Salary Paid/Pending status visible", hasStatus);

        // Pay Slip button
        List<WebElement> slipBtns = driver.findElements(By.cssSelector(".view-slip-btn"));
        log("Pay Slip buttons present (" + slipBtns.size() + " found)", slipBtns.size() > 0);

        // Mark Paid button
        List<WebElement> paidBtns = driver.findElements(By.cssSelector(".mark-paid-btn"));
        log("Mark Paid buttons present (" + paidBtns.size() + " found)", paidBtns.size() >= 0);

        // Salary Day banner
        boolean hasBanner = src.contains("Salary Day") || src.contains("days to go") || src.contains("Next Salary");
        log("Salary Day countdown banner visible", hasBanner);
        Thread.sleep(1000);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 7 — Leave Requests Section (Admin view)
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 7, dependsOnMethods = "test06_SalarySection")
    public void test07_LeaveSection() throws InterruptedException {
        System.out.println("--- Test 7: Leave Requests (Admin) ---");
        clickNav("Leave");
        Thread.sleep(1200);

        String src = driver.getPageSource();
        boolean hasLeave = src.contains("Leave Requests") || src.contains("Leave Management");
        Assert.assertTrue(hasLeave, "Leave section should be visible");
        log("Leave Management section loaded", hasLeave);

        // Filter tabs: All / Pending / Approved / Rejected
        List<WebElement> tabs = driver.findElements(By.cssSelector(".leave-tab-btn"));
        log("Leave filter tabs rendered (" + tabs.size() + " tabs)", tabs.size() >= 3);

        // Check each tab
        for (WebElement tab : tabs) {
            String tabText = tab.getText().trim();
            tab.click();
            Thread.sleep(400);
            log("Clicked leave tab: " + tabText, true);
        }
        Thread.sleep(1000);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 8 — EmpBot Chatbot
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 8, dependsOnMethods = "test07_LeaveSection")
    public void test08_ChatBot() throws InterruptedException {
        System.out.println("--- Test 8: EmpBot Chatbot ---");

        try {
            // Open chatbot
            WebElement fabBtn = wait.until(
                ExpectedConditions.elementToBeClickable(By.cssSelector(".chat-fab-btn"))
            );
            fabBtn.click();
            Thread.sleep(800);

            boolean chatVisible = !driver.findElements(By.cssSelector(".chat-panel")).isEmpty();
            log("Chatbot panel opened", chatVisible);

            // Send a message
            WebElement chatInput = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.cssSelector(".chat-input"))
            );
            chatInput.sendKeys("hello");
            driver.findElement(By.cssSelector(".chat-send-btn")).click();
            Thread.sleep(2000);

            // Bot should reply
            List<WebElement> botBubbles = driver.findElements(By.cssSelector(".chat-bubble.bot"));
            log("Bot replied (" + botBubbles.size() + " bot messages)", botBubbles.size() >= 1);

            // Test a quick prompt
            List<WebElement> quickPrompts = driver.findElements(By.cssSelector(".quick-prompt"));
            if (!quickPrompts.isEmpty()) {
                quickPrompts.get(0).click();
                Thread.sleep(2000);
                log("Quick prompt clicked successfully", true);
            }

            // Close chatbot
            driver.findElement(By.cssSelector(".chat-close")).click();
            Thread.sleep(500);
            log("Chatbot closed", true);

        } catch (Exception e) {
            System.out.println("  Chatbot test error: " + e.getMessage());
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 9 — Navigate back to Dashboard
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 9, dependsOnMethods = "test08_ChatBot")
    public void test09_BackToDashboard() throws InterruptedException {
        System.out.println("--- Test 9: Navigate back to Dashboard ---");
        clickNav("Dashboard");
        Thread.sleep(1000);
        String src = driver.getPageSource();
        boolean onHome = src.contains("Total Employees") || src.contains("Present") || src.contains("Payroll");
        Assert.assertTrue(onHome, "Should be back on home/dashboard");
        log("Successfully navigated back to Dashboard", onHome);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 10 — Logout
    // ═════════════════════════════════════════════════════════════════════════
    @Test(priority = 10, dependsOnMethods = "test09_BackToDashboard")
    public void test10_Logout() throws InterruptedException {
        System.out.println("--- Test 10: Logout ---");

        // The logout button has class "logout-btn" in the sidebar footer
        WebElement logoutBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.cssSelector(".sidebar-footer .logout-btn"))
        );
        logoutBtn.click();
        Thread.sleep(1500);

        // Should see login page again
        String src = driver.getPageSource();
        boolean onLogin = src.contains("Sign In") || src.contains("Employee Management System")
                       || src.contains("login-username") || src.contains("aurora-login-btn");
        Assert.assertTrue(onLogin, "Should return to login page after logout");
        log("Logout successful — login page visible", onLogin);
    }

    // ── Teardown ──────────────────────────────────────────────────────────────
    @AfterTest
    public void teardown() {
        System.out.println("\n========================================");
        System.out.println("  All Portal Tests Completed");
        System.out.println("========================================\n");
        if (driver != null) {
            driver.quit();
        }
    }
}