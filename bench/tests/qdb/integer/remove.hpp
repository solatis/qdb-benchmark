#pragma once

#include <bench/tests/qdb/qdb_test_template.hpp>

namespace bench
{
namespace tests
{
namespace qdb
{
namespace integer
{
class remove : public qdb_test_template<remove>
{
public:
    explicit remove(bench::test_config config) : qdb_test_template(config)
    {
    }

    void setup() override
    {
        qdb_test_template::setup();

        setup_each([=](unsigned long iteration)
                   {
                       _qdb.int_put(alias(iteration), 42);
                   });
    }

    void run_iteration(unsigned long iteration)
    {
        _qdb.remove(alias(iteration));
    }

    static std::string name()
    {
        return "qdb_int_remove";
    }

    static std::string description()
    {
        return "Each thread repeats qdb_remove() on integer entries";
    }

    static bool size_dependent()
    {
        return false;
    }
};
} // namespace integer
} // namespace qdb
} // namespace tests
} // namespace bench
