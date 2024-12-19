<script lang="ts">
	import { getUserId } from '$src/lib/utility/helper';
	import { plans } from '$lib/utility/plans';

	let monthly = $state(true);
	let { plan, status, session } = $props();

	const togglePeriod = async () => {
		monthly = !monthly;
	};

	const getDestination = (name: string) => {
		let plan_0 = plans[0].name;
		let plan_1 = plans[1].name;
		let plan_2 = plans[2].name;

		if (getUserId(session) == null) {
			return '?/toSignIn';
		}
		if (status == undefined) {
			if (name == plan_0) return '?/toApp';
			return '?/subscribe';
		}
		if (name == plan_0 && status.plan != plan_0) {
			return '';
		}
		if (name == plan_1 && status.plan == plan_0) {
			return '?/subscribe';
		}
		if (name == plan_1 && status.plan == plan_1) {
			return '?/toApp';
		}
		if (name == plan_1 && status.plan == plan_2) {
			return '';
		}
		if (name == plan_2 && status.plan == plan_0) {
			return '?/subscribe';
		}
		if (name == plan_2 && status.plan == plan_1) {
			return '?/toContact';
		}
		if (name == plan_2 && status.plan == plan_2) {
			return '?/toApp';
		}
	};

	const getButtonText = (name: string) => {
		let plan_0 = plans[0].name;
		let plan_1 = plans[1].name;
		let plan_2 = plans[2].name;

		if (getUserId(session) == null) {
			return 'Get started';
		}
		if (status == undefined) {
			if (name == plan_0) return 'Launch';
			return 'Subscribe';
		}
		if (name == status.plan) {
			return 'Launch';
		}
		if (name == plan_0 && status.plan != plan_0) {
			return 'n/a';
		}
		if ((name == plan_1 || name == plan_2) && status.plan == plan_0) {
			return 'Subscribe';
		}
		if (name == plan_1 && status.plan == plan_2) {
			return 'n/a';
		}
		if (name == plan_2 && status.plan == plan_1) {
			return 'Contact us';
		}
	};

	const getDisabled = (name: string) => {
		let plan_0 = plans[0].name;
		let plan_1 = plans[1].name;
		let plan_2 = plans[2].name;

		if (status == undefined) {
			return false;
		}
		if (name == plan_0 && status.plan != plan_0) {
			return true;
		}
		if (name == plan_1 && status.plan == plan_2) {
			return true;
		}
		return false;
	};
</script>

<div>
	<!-- "Popular" overlay pt. I -->
	<div class="relative w-72 md:w-80 h-100 bg-base-100 rounded-2xl">
		<!-- Card -->
		<div class="flex card w-72 md:w-80 bg-base-100 shadow-xl h-full">
			<div class="card-body p-4 md:p-6">
				<div class="flex flex-row justify-end items-center h-5 space-x-2 mt-2">
					{#if plan.id != 'free'}
						<span class="text-xs" class:font-bold={monthly}>Monthly</span>
						<input
							type="checkbox"
							class="toggle border-bg-red-800 bg-red-800 [--tglbg:white] hover:bg-red-800"
							onchange={togglePeriod}
						/>
						<span class="text-xs" class:font-bold={!monthly}>Annually</span>
					{/if}
				</div>
				<div class="flex flex-row items-baseline justify-center mb-0 mt-6">
					{#if plan.id != 'free'}
						<h1 class="mr-2 text-4xl">{monthly ? plan.price[0] : plan.price[1]}</h1>
						{monthly ? '⁄ month' : '⁄ year'}
					{:else}
						<h1 class="mr-2 text-4xl">$0</h1>
					{/if}
				</div>
				<div class="mt-0 mb-4 flex justify-center">
					<h3 class="text-gray-500">{plan.name}</h3>
				</div>
				<div class="divider"></div>
				<h3 class="mb-2">Features</h3>
				<ul class="space-y-2">
					{#each plan.features as feature}
						<li>
							<img class="mr-4" width="22px" src="/accept.png" alt="check" />{feature}
						</li>
					{/each}
				</ul>
				<form method="POST" action={getDestination(plan.name)}>
					<div class="form-control mt-8">
						<input
							type="hidden"
							name="priceId"
							value={plan.id != 'free'
								? monthly
									? plan.priceId[0]
									: plan.priceId[1]
								: 0}
						/>
						<input type="hidden" name="userId" value={getUserId(session)} />
						<button class="btn btn-primary" disabled={getDisabled(plan.name)}>
							{getButtonText(plan.name)}
						</button>
					</div>
				</form>
			</div>
		</div>
		<!-- Popular overlay pt. II, set class to rotate-45 and adjust coordinates for ribbon style -->
		<div class="absolute right-0 top-0">
			{#if plan.popular == 'true'}
				<div
					class="content-center shadow-lg absolute rounded bg-teal-700 text-center align-text-bottom text-white font-black right-[58px] top-[-36px] w-[170px] md:right-[72px] md:top-[-48px] md:w-[170px] h-10"
				>
					POPULAR
				</div>
			{/if}
		</div>
	</div>
</div>
