"""One persisted CI session for the eval tests and the YAML redteam suite."""

from pathlib import Path

from martian.ci import CiSuite, run

if __name__ == "__main__":
    result = run(
        CiSuite(
            evals_paths=(Path("tests/evals"),),
            redteam_config=Path("redteam.yaml"),
            output_dir=Path("results"),
            require_export=True,
        )
    )
    print(f"CI state: {result.state}; Backend session: {result.session_id or 'not persisted'}")
    print("Safe receipt: results/ci-session.json")
    raise SystemExit(result.exit_code)
