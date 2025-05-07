<script lang="ts">
	import { onMount } from 'svelte';

	let title = 'About Agile, Scrum, and Scrum Story Points';

	onMount(() => {
		document.title = title;
	});
</script>

<div class="mx-auto my-8 max-w-4xl rounded-lg bg-white p-8">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">About Agile, Scrum, and Scrum Story Points</h1>

	<h2 class="mb-4 text-2xl font-semibold text-gray-700">What is Agile?</h2>
	<p class="mb-4 text-gray-600">
		Agile is a flexible and iterative approach to project management and software development that
		emphasizes collaboration, customer feedback, and rapid delivery of small, functional increments
		of work. It prioritizes individuals and interactions, working software, customer collaboration,
		and responding to change over rigid processes and plans, as outlined in the <a
			href="https://agilemanifesto.org/"
			target="_blank"
			class="text-blue-600 hover:underline">Agile Manifesto</a
		>.
	</p>

	<h2 class="mb-4 text-2xl font-semibold text-gray-700">What is Scrum?</h2>
	<p class="mb-4 text-gray-600">
		Scrum is a popular framework within Agile that organizes work into short, time-boxed iterations
		called Sprints, typically lasting 1-4 weeks. Scrum teams work collaboratively to deliver small,
		usable pieces of a project, adapting to changing requirements. The framework includes:
	</p>
	<div class="mx-8">
		<ul class="mb-4 list-disc pl-6 text-gray-600">
			<li>
				<span class="font-medium">Roles:</span> Product Owner, Scrum Master, and Development Team.
			</li>
			<li>
				<span class="font-medium">Artifacts:</span> Product Backlog, Sprint Backlog, and Increment.
			</li>
			<li>
				<span class="font-medium">Events:</span> Sprint Planning, Daily Scrum, Sprint Review, and Sprint
				Retrospective.
			</li>
		</ul>
	</div>
	<p class="mb-4 text-gray-600">
		Scrum fosters transparency, inspection, and adaptation, enabling teams to deliver high-value
		products efficiently.
	</p>

	<h2 class="mb-4 text-2xl font-semibold text-gray-700">Backlog Grooming and Scrum Story Points</h2>
	<p class="mb-4 text-gray-600">
		Backlog grooming (or refinement) is a Scrum practice where the team reviews, prioritizes, and
		estimates the effort for tasks in the Product Backlog. This ensures the backlog remains
		well-organized, relevant, and ready for upcoming Sprints.
	</p>
	<p class="mb-4 text-gray-600">
		One effective technique for estimating effort during backlog grooming is <span
			class="font-medium">Scrum Story Points</span
		>, also known as Planning Poker. This collaborative method helps teams assign story points to
		tasks based on their complexity, effort, and uncertainty.
	</p>

	<h2 class="mb-4 text-2xl font-semibold text-gray-700">
		How to Point a Task with Scrum Story Points
	</h2>
	<p class="mb-4 text-gray-600">
		Scrum Story Points is a fun and engaging way to estimate tasks as a group. Here’s how it works:
	</p>
	<ol class="mb-4 list-decimal pl-6 text-gray-600">
		<li>
			<span class="font-medium">Prepare the Backlog:</span> The Product Owner presents a user story or
			task from the Product Backlog, ensuring the team understands its requirements and acceptance criteria.
		</li>
		<li>
			<span class="font-medium">Discuss the Task:</span> The team discusses the task, asking questions
			to clarify scope, technical challenges, and dependencies. This ensures everyone has a shared understanding.
		</li>
		<li>
			<span class="font-medium">Choose a Pointing Scale:</span> Story points are typically assigned using
			a Fibonacci-like sequence (e.g., 1, 2, 3, 5, 8, 13, 21) or a similar scale. Each number represents
			the relative effort, complexity, and risk of the task.
		</li>
		<li>
			<span class="font-medium">Estimate Individually:</span> Each team member privately selects a story
			point value they believe reflects the task’s effort. This can be done using physical cards, a digital
			tool, or our website’s Scrum Story Points feature.
		</li>
		<li>
			<span class="font-medium">Reveal and Discuss:</span> All team members reveal their estimates simultaneously.
			If estimates vary widely, the team discusses the reasoning behind high and low values to align
			their understanding.
		</li>
		<li>
			<span class="font-medium">Reach Consensus:</span> The team repeats the estimation process until
			they agree on a story point value. The Scrum Master facilitates to ensure productive discussion
			and consensus.
		</li>
		<li>
			<span class="font-medium">Record and Move On:</span> The agreed-upon story points are recorded
			for the task, and the team moves to the next item in the backlog.
		</li>
	</ol>

	<h2 class="mb-4 text-2xl font-semibold text-gray-700">Why Use Scrum Story Points?</h2>
	<p class="mb-4 text-gray-600">
		Scrum Story Points promotes collaboration, reduces bias, and leverages the team’s collective
		expertise. By estimating as a group, teams gain a shared understanding of tasks, improve
		accuracy in planning, and enhance commitment to Sprint goals.
	</p>
	<p class="mb-4 text-gray-600">
		Our website’s Scrum Story Points tool makes this process seamless, allowing remote and in-person
		teams to estimate tasks efficiently and keep their backlog ready for action.
	</p>

	<p><a href="/" class="text-blue-600 hover:underline">Back to Home</a></p>
</div>
